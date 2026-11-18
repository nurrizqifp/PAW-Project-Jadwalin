/**
 * controllers/jadwalController.js
 * Controller Jadwal (PRD F-05, F-07)
 *   GET  /api/jadwal         - daftar jadwal, filter kombinasi dosen, ruang, kelas, hari, semester
 *   POST /api/jadwal/revisi  - edit slot cepat + re-check konflik
 *   POST /api/jadwal/publish - validasi zero-clash, lalu status menjadi Terpublikasi
 *
 * Deteksi konflik di bawah bersifat lokal (HC-01, HC-02, HC-03, LAB-MATCH) dan membaca aturan aktif dari
 * tabel constraint_hards. Jika services/konflikService.js (branch nurrizqifp) sudah ter-merge, cukup
 * ganti isi hitungKonflik() agar memanggilnya.
 */
const { z } = require('zod');
const { Op } = require('sequelize');
const db = require('../models');
const notifikasiService = require('../services/notifikasiService');

const { sequelize, PeriodeJadwal, JadwalSesi, JadwalDosen, MataKuliah, Ruangan, Dosen, ConstraintHard, KonflikLog } = db;

const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const JAM = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
const DHUHUR_MULAI = 11 * 60 + 30; // 11:30
const DHUHUR_SELESAI = 12 * 60 + 10; // 12:10

/* ------------------------------------------------------------------ */
/* Validasi input (Zod)                                                 */
/* ------------------------------------------------------------------ */

const queryJadwalSchema = z.object({
  dosen: z.string().trim().max(120).optional(),
  ruang: z.string().trim().max(40).optional(),
  kelas: z.string().trim().regex(/^[A-Za-z0-9]{1,5}$/, 'Kelas tidak valid').transform((k) => k.toUpperCase()).optional(),
  hari: z.enum([...HARI, 'Semua'], { message: 'Hari tidak valid' }).optional(),
  semester: z.coerce.number().int().min(1, 'Semester wajib 1-8').max(8, 'Semester wajib 1-8').optional(),
  peminatan: z.string().trim().max(10).optional(),
  periodeId: z.coerce.number().int().positive().optional(),
});

const revisiSchema = z
  .object({
    id: z.coerce.number().int().positive({ message: 'ID sesi wajib diisi' }),
    hari: z.enum(HARI, { message: 'Hari tidak valid' }).optional(),
    jamMulai: z.string().regex(JAM, 'Format jam HH:MM').optional(),
    jamSelesai: z.string().regex(JAM, 'Format jam HH:MM').optional(),
    ruang: z.string().trim().min(2, 'Kode ruang minimal 2 karakter').max(40).optional(),
  })
  .refine((d) => d.hari || d.jamMulai || d.jamSelesai || d.ruang, {
    message: 'Minimal satu perubahan (hari, jamMulai, jamSelesai, atau ruang) wajib diisi.',
  });

const publishSchema = z.object({
  periodeId: z.coerce.number().int().positive().optional(),
});

/* ------------------------------------------------------------------ */
/* Helper                                                               */
/* ------------------------------------------------------------------ */

/** Error terkontrol: dilempar di dalam transaksi agar rollback, lalu dipetakan ke respons HTTP. */
class ErrorTerkontrol extends Error {
  constructor(status, pesan, extra = {}) {
    super(pesan);
    this.name = 'ErrorTerkontrol';
    this.status = status;
    this.extra = extra;
  }
}

const tanganiError = (err, res, next) => {
  if (err && err.name === 'ErrorTerkontrol') {
    return res.status(err.status).json({ sukses: false, pesan: err.message, ...err.extra });
  }
  return next(err);
};

// Query string kosong (?dosen=) dianggap tidak mengirim filter.
const bersihkanQuery = (query) =>
  Object.fromEntries(Object.entries(query).filter(([, v]) => typeof v === 'string' && v.trim() !== ''));

const keMenit = (jam) => {
  const [h, m] = String(jam || '00:00').split(':').map(Number);
  return h * 60 + m;
};

const overlap = (a, b) =>
  keMenit(a.jam_mulai) < keMenit(b.jam_selesai) && keMenit(b.jam_mulai) < keMenit(a.jam_selesai);

const melewatiDhuhur = (jamMulai, jamSelesai) =>
  keMenit(jamMulai) < DHUHUR_SELESAI && keMenit(jamSelesai) > DHUHUR_MULAI;

const escapeLike = (teks) => String(teks).replace(/[\\%_]/g, '\\$&');

const INCLUDE_SESI = [
  { model: MataKuliah, as: 'mataKuliah' },
  { model: Ruangan, as: 'ruangan' },
  { model: Dosen, as: 'dosens', through: { attributes: [] } },
];

/** Bentuk respons sesi: kodeMatkul wajib ada (audit fase 1). */
function formatSesi(sesi) {
  const mk = sesi.mataKuliah || {};
  const ruang = sesi.ruangan || null;
  const dosens = sesi.dosens || [];

  return {
    id: sesi.id,
    periodeId: sesi.periode_id,
    kodeMatkul: mk.kode || null,
    mataKuliah: mk.nama || null,
    sks: mk.sks ?? null,
    semester: mk.semester ?? null,
    jenis: mk.jenis || null,
    kelas: sesi.kelas,
    kelasList: String(sesi.kelas || '').split(';').map((k) => k.trim()).filter(Boolean),
    hari: sesi.hari,
    jamMulai: sesi.jam_mulai,
    jamSelesai: sesi.jam_selesai,
    ruang: ruang ? ruang.kode : null,
    gedung: ruang ? ruang.gedung : null,
    tipeRuang: ruang ? ruang.tipe : null,
    dosenInisial: dosens.map((d) => d.inisial).join(';'),
    dosen: dosens.map((d) => d.nama).join(' & '),
    dosenList: dosens.map((d) => ({ id: d.id, inisial: d.inisial, nama: d.nama })),
    isPilihan: Boolean(sesi.is_pilihan),
    peminatanKode: mk.kode_peminatan || null,
    isLabValid: Boolean(sesi.is_lab_valid),
    melewatiIstirahat: Boolean(sesi.melewati_istirahat),
  };
}

const urutkanSesi = (a, b) =>
  HARI.indexOf(a.hari) - HARI.indexOf(b.hari) || keMenit(a.jamMulai) - keMenit(b.jamMulai) || a.id - b.id;

const formatPeriode = (periode, versi) => ({
  id: periode.id,
  nama: periode.nama,
  tahunAkademik: periode.tahun_akademik,
  semesterTipe: periode.semester_tipe,
  status: periode.status,
  generatedAt: periode.generated_at,
  publishedAt: periode.published_at,
  versi: versi || null,
});

/**
 * Admin: periode terbaru yang belum diarsipkan (atau periodeId eksplisit).
 * Selain admin: hanya periode berstatus Terpublikasi.
 */
async function resolvePeriode({ periodeId, isAdmin, transaction } = {}) {
  if (periodeId) return PeriodeJadwal.findByPk(periodeId, { transaction });
  if (isAdmin) {
    return PeriodeJadwal.findOne({ where: { status: { [Op.ne]: 'Arsip' } }, order: [['id', 'DESC']], transaction });
  }
  return PeriodeJadwal.findOne({
    where: { status: 'Terpublikasi' },
    order: [['published_at', 'DESC'], ['id', 'DESC']],
    transaction,
  });
}

/* ------------------------------------------------------------------ */
/* Deteksi konflik hard constraint                                      */
/* ------------------------------------------------------------------ */

async function constraintAktif(transaction) {
  const rows = await ConstraintHard.findAll({ transaction });
  const peta = {};
  rows.forEach((r) => {
    peta[r.kode] = r.is_active;
  });
  // Aturan yang belum ada barisnya dianggap aktif (PRD: 0 bentrok dosen & ruangan).
  const aktif = (kode) => (kode in peta ? Boolean(peta[kode]) : true);
  return { 'HC-01': aktif('HC-01'), 'HC-02': aktif('HC-02'), 'HC-03': aktif('HC-03'), 'LAB-MATCH': aktif('LAB-MATCH') };
}

/** Hitung seluruh pelanggaran hard constraint pada satu periode. */
async function hitungKonflik(periodeId, transaction) {
  const [aktif, sesiList] = await Promise.all([
    constraintAktif(transaction),
    JadwalSesi.findAll({ where: { periode_id: periodeId }, include: INCLUDE_SESI, transaction }),
  ]);

  const daftar = [];
  const label = (s) => `${s.mataKuliah ? s.mataKuliah.kode : 'MK?'} (Kelas ${s.kelas})`;

  for (let i = 0; i < sesiList.length; i++) {
    const a = sesiList[i];

    if (aktif['HC-03'] && melewatiDhuhur(a.jam_mulai, a.jam_selesai)) {
      daftar.push({
        kode: 'HC-03',
        jenis: 'Jeda Ibadah Dhuhur',
        deskripsi: `${label(a)} pada ${a.hari} ${a.jam_mulai}-${a.jam_selesai} melewati jeda Dhuhur 11:30-12:10.`,
        saran: 'Majukan sesi agar selesai paling lambat 11:30 atau mulai setelah 12:10.',
        sesiIds: [a.id],
      });
    }

    if (aktif['LAB-MATCH'] && a.mataKuliah && a.mataKuliah.jenis === 'Praktikum') {
      if (!a.ruangan || a.ruangan.tipe !== 'Laboratorium') {
        daftar.push({
          kode: 'LAB-MATCH',
          jenis: 'Praktikum Bukan di Laboratorium',
          deskripsi: `${label(a)} adalah praktikum tetapi ruangnya ${a.ruangan ? a.ruangan.kode : 'belum ditentukan'}.`,
          saran: 'Pindahkan sesi ke ruangan bertipe Laboratorium.',
          sesiIds: [a.id],
        });
      }
    }

    for (let j = i + 1; j < sesiList.length; j++) {
      const b = sesiList[j];
      if (a.hari !== b.hari || !overlap(a, b)) continue;

      if (aktif['HC-01']) {
        const dosenB = new Set((b.dosens || []).map((d) => d.id));
        const bersama = (a.dosens || []).filter((d) => dosenB.has(d.id));
        if (bersama.length > 0) {
          daftar.push({
            kode: 'HC-01',
            jenis: 'Bentrok Dosen',
            deskripsi: `Dosen ${bersama.map((d) => d.inisial).join(', ')} terjadwal ganda pada ${a.hari} (${a.jam_mulai}-${a.jam_selesai}) di ${label(a)} dan ${label(b)}.`,
            saran: `Geser salah satu sesi ke slot lain di hari ${a.hari} atau ganti dosen pengampu.`,
            sesiIds: [a.id, b.id],
          });
        }
      }

      if (aktif['HC-02'] && a.ruangan_id && a.ruangan_id === b.ruangan_id) {
        daftar.push({
          kode: 'HC-02',
          jenis: 'Bentrok Ruangan',
          deskripsi: `Ruangan ${a.ruangan ? a.ruangan.kode : a.ruangan_id} dipakai bersamaan oleh ${label(a)} dan ${label(b)} pada ${a.hari}.`,
          saran: 'Pindahkan salah satu sesi ke ruangan lain yang kosong dengan kapasitas setara.',
          sesiIds: [a.id, b.id],
        });
      }
    }
  }

  const praktikum = sesiList.filter((s) => s.mataKuliah && s.mataKuliah.jenis === 'Praktikum');
  const praktikumDiLab = praktikum.filter((s) => s.ruangan && s.ruangan.tipe === 'Laboratorium');

  return {
    total: daftar.length,
    daftar,
    jumlahSesi: sesiList.length,
    ringkasan: {
      bentrokDosenRuangan: daftar.filter((k) => k.kode === 'HC-01' || k.kode === 'HC-02').length,
      labMatchingPercent: praktikum.length ? Math.round((praktikumDiLab.length / praktikum.length) * 1000) / 10 : 100,
    },
  };
}

/** Simpan hasil re-check ke konflik_logs (pelanggaran lama yang belum selesai diganti hasil terbaru). */
async function sinkronKonflikLog(periodeId, daftar, transaction) {
  await KonflikLog.destroy({ where: { periode_id: periodeId, is_resolved: false }, transaction });
  if (daftar.length === 0) return;
  await KonflikLog.bulkCreate(
    daftar.map((k) => ({
      periode_id: periodeId,
      tipe: k.jenis.slice(0, 50),
      kode_constraint: k.kode,
      deskripsi: k.deskripsi,
      saran_perbaikan: k.saran,
      is_resolved: false,
    })),
    { transaction }
  );
}

/* ------------------------------------------------------------------ */
/* GET /api/jadwal                                                      */
/* ------------------------------------------------------------------ */

exports.daftar = async (req, res, next) => {
  try {
    const parsed = queryJadwalSchema.safeParse(bersihkanQuery(req.query));
    if (!parsed.success) {
      return res.status(400).json({ sukses: false, pesan: parsed.error.issues[0]?.message || 'Filter jadwal tidak valid.' });
    }
    const filter = parsed.data;
    const pengguna = req.user || null;
    const role = pengguna ? pengguna.role : null;
    const isAdmin = role === 'admin';

    const periode = await resolvePeriode({ periodeId: filter.periodeId, isAdmin });
    if (!periode) {
      return res.json({
        sukses: true,
        pesan: 'Belum ada jadwal yang dipublikasikan.',
        statusJadwal: null,
        periode: null,
        totalKonflik: 0,
        daftarKonflik: [],
        jumlah: 0,
        data: [],
      });
    }
    if (!isAdmin && periode.status !== 'Terpublikasi') {
      throw new ErrorTerkontrol(403, 'Jadwal untuk periode ini belum dipublikasikan.');
    }

    const where = { periode_id: periode.id };
    const idSesi = []; // himpunan id sesi per filter berbasis relasi (AND antar filter)

    // PRD US-06: dosen hanya melihat kelas yang ia ampu.
    let dosenIds = null;
    if (role === 'dosen') {
      dosenIds = pengguna.refId ? [pengguna.refId] : [];
    } else if (filter.dosen) {
      const kata = `%${escapeLike(filter.dosen)}%`;
      const dosens = await Dosen.findAll({
        attributes: ['id'],
        where: { [Op.or]: [{ inisial: { [Op.iLike]: kata } }, { nama: { [Op.iLike]: kata } }] },
      });
      dosenIds = dosens.map((d) => d.id);
    }
    if (dosenIds) {
      const pivot = await JadwalDosen.findAll({ attributes: ['jadwal_sesi_id'], where: { dosen_id: dosenIds } });
      idSesi.push(pivot.map((p) => p.jadwal_sesi_id));
    }

    if (filter.ruang) {
      const ruangs = await Ruangan.findAll({
        attributes: ['id'],
        where: { kode: { [Op.iLike]: `%${escapeLike(filter.ruang)}%` } },
      });
      where.ruangan_id = ruangs.map((r) => r.id);
    }

    if (filter.kelas) {
      const k = filter.kelas; // kolom kelas bisa gabungan, mis. "A;C"
      where.kelas = { [Op.or]: [k, { [Op.like]: `${k};%` }, { [Op.like]: `%;${k}` }, { [Op.like]: `%;${k};%` }] };
    }

    if (filter.hari && filter.hari !== 'Semua') where.hari = filter.hari;

    if (idSesi.length > 0) {
      where.id = idSesi.reduce((acc, ids) => acc.filter((id) => ids.includes(id)));
    }

    const include = INCLUDE_SESI.map((inc) => ({ ...inc }));
    if (filter.semester) include[0] = { ...include[0], where: { semester: filter.semester }, required: true };

    let data = (await JadwalSesi.findAll({ where, include })).map(formatSesi);
    if (filter.peminatan) {
      const p = String(filter.peminatan).toUpperCase();
      data = data.filter((s) => !(s.isPilihan && s.peminatanKode && s.peminatanKode.toUpperCase() !== p));
    }
    data.sort(urutkanSesi);

    const [konflik, versi] = await Promise.all([
      hitungKonflik(periode.id),
      notifikasiService.versiPublikasiTerakhir(periode.id),
    ]);

    return res.json({
      sukses: true,
      statusJadwal: periode.status,
      periode: formatPeriode(periode, versi),
      totalKonflik: konflik.total,
      daftarKonflik: isAdmin ? konflik.daftar : [],
      // PRD F-05: tombol Publikasikan nonaktif jika masih ada bentrok hard constraint.
      canPublish: isAdmin ? konflik.total === 0 && konflik.jumlahSesi > 0 : undefined,
      jumlah: data.length,
      data,
    });
  } catch (err) {
    return tanganiError(err, res, next);
  }
};

/* ------------------------------------------------------------------ */
/* POST /api/jadwal/revisi                                              */
/* ------------------------------------------------------------------ */

const ringkasSlot = (s) => `${s.hari} ${s.jamMulai}-${s.jamSelesai} (${s.ruang || 'tanpa ruang'})`;

exports.revisi = async (req, res, next) => {
  try {
    const parsed = revisiSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ sukses: false, pesan: parsed.error.issues[0]?.message || 'Input revisi jadwal tidak valid.' });
    }
    const { id, hari, jamMulai, jamSelesai, ruang } = parsed.data;

    const hasil = await sequelize.transaction(async (t) => {
      const kunci = await JadwalSesi.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
      if (!kunci) throw new ErrorTerkontrol(404, 'Sesi jadwal tidak ditemukan.');

      const periode = await PeriodeJadwal.findByPk(kunci.periode_id, { transaction: t });
      if (periode.status === 'Arsip') {
        throw new ErrorTerkontrol(409, 'Periode jadwal sudah diarsipkan dan tidak dapat direvisi.');
      }

      const sesi = await JadwalSesi.findByPk(id, { include: INCLUDE_SESI, transaction: t });
      const lama = formatSesi(sesi);

      let ruangan = sesi.ruangan;
      if (ruang && (!ruangan || ruangan.kode !== ruang)) {
        ruangan = await Ruangan.findOne({ where: { kode: ruang }, transaction: t });
        if (!ruangan) throw new ErrorTerkontrol(404, `Ruangan '${ruang}' tidak ditemukan.`);
      }

      const hariBaru = hari || sesi.hari;
      const mulaiBaru = jamMulai || sesi.jam_mulai;
      const selesaiBaru = jamSelesai || sesi.jam_selesai;
      if (keMenit(selesaiBaru) <= keMenit(mulaiBaru)) {
        throw new ErrorTerkontrol(422, 'Jam selesai harus lebih besar dari jam mulai.');
      }

      const versi = await notifikasiService.versiPublikasiTerakhir(periode.id);
      const tidakBerubah =
        hariBaru === sesi.hari &&
        mulaiBaru === sesi.jam_mulai &&
        selesaiBaru === sesi.jam_selesai &&
        (!ruangan || ruangan.id === sesi.ruangan_id);

      if (tidakBerubah) {
        const saatIni = await hitungKonflik(periode.id, t);
        return { berubah: false, sesi: lama, periode: formatPeriode(periode, versi), konflik: saatIni, notifikasiDibuat: 0 };
      }

      const jenisMk = sesi.mataKuliah ? sesi.mataKuliah.jenis : 'Teori';
      await sesi.update(
        {
          hari: hariBaru,
          jam_mulai: mulaiBaru,
          jam_selesai: selesaiBaru,
          ruangan_id: ruangan ? ruangan.id : sesi.ruangan_id,
          melewati_istirahat: melewatiDhuhur(mulaiBaru, selesaiBaru),
          is_lab_valid: !(jenisMk === 'Praktikum' && (!ruangan || ruangan.tipe !== 'Laboratorium')),
        },
        { transaction: t }
      );

      const baru = formatSesi(await JadwalSesi.findByPk(id, { include: INCLUDE_SESI, transaction: t }));

      // Re-check konflik seluruh periode (DoD: revisi memicu re-check konflik).
      const konflik = await hitungKonflik(periode.id, t);
      const terkait = konflik.daftar.filter((k) => Array.isArray(k.sesiIds) && k.sesiIds.includes(id));

      // Jadwal yang sudah terbit wajib tetap 0 bentrok (PRD M-02): revisi yang menimbulkan bentrok ditolak.
      if (periode.status === 'Terpublikasi' && terkait.length > 0) {
        throw new ErrorTerkontrol(
          409,
          `Revisi ditolak: slot baru menimbulkan ${terkait.length} bentrok hard constraint pada jadwal terpublikasi.`,
          { totalKonflik: terkait.length, konflik: terkait }
        );
      }

      await sinkronKonflikLog(periode.id, konflik.daftar, t);

      const notifikasiDibuat = await notifikasiService.catatPerubahanSlot({
        periode,
        sesi: baru,
        lama: ringkasSlot(lama),
        baru: ringkasSlot(baru),
        aktor: req.user ? req.user.username : null,
        transaction: t,
      });

      return { berubah: true, sesi: baru, periode: formatPeriode(periode, versi), konflik, notifikasiDibuat };
    });

    const total = hasil.konflik.total;
    let pesan = 'Tidak ada perubahan pada slot.';
    if (hasil.berubah) {
      pesan = total > 0
        ? `Jadwal diperbarui, namun terdeteksi ${total} konflik hard constraint.`
        : 'Jadwal berhasil diperbarui tanpa konflik (0 bentrok).';
    }

    return res.json({
      sukses: true,
      pesan,
      berubah: hasil.berubah,
      sesi: hasil.sesi,
      periode: hasil.periode,
      status: hasil.periode.status,
      totalKonflik: total,
      konflik: hasil.konflik.daftar,
      canPublish: total === 0,
      notifikasiDibuat: hasil.notifikasiDibuat,
    });
  } catch (err) {
    return tanganiError(err, res, next);
  }
};

/* ------------------------------------------------------------------ */
/* POST /api/jadwal/publish                                             */
/* ------------------------------------------------------------------ */

exports.publish = async (req, res, next) => {
  try {
    const parsed = publishSchema.safeParse(req.body || {});
    if (!parsed.success) {
      return res.status(400).json({ sukses: false, pesan: parsed.error.issues[0]?.message || 'periodeId tidak valid.' });
    }
    const { periodeId } = parsed.data;

    const keluaran = await sequelize.transaction(async (t) => {
      const periode = periodeId
        ? await PeriodeJadwal.findByPk(periodeId, { transaction: t, lock: t.LOCK.UPDATE })
        : await PeriodeJadwal.findOne({
            where: { status: { [Op.ne]: 'Arsip' } },
            order: [['id', 'DESC']],
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
      if (!periode) throw new ErrorTerkontrol(404, 'Periode jadwal tidak ditemukan.');
      if (periode.status === 'Arsip') {
        throw new ErrorTerkontrol(409, 'Periode yang sudah diarsipkan tidak dapat dipublikasikan.');
      }

      const konflik = await hitungKonflik(periode.id, t);
      if (konflik.jumlahSesi === 0) {
        throw new ErrorTerkontrol(422, 'Belum ada sesi jadwal pada periode ini, tidak ada yang dapat dipublikasikan.');
      }

      // Guard F-05: tolak publikasi bila masih ada bentrok. Dilempar setelah transaksi selesai
      // agar log konflik yang disimpan tidak ikut di-rollback.
      if (konflik.total > 0) return { ditolak: true, periodeId: periode.id, konflik };

      // Hanya satu periode Terpublikasi dalam satu waktu (SYSTEM_DESIGN).
      await PeriodeJadwal.update(
        { status: 'Arsip' },
        { where: { status: 'Terpublikasi', id: { [Op.ne]: periode.id } }, transaction: t }
      );

      const sekarang = new Date();
      const versi = await notifikasiService.versiPublikasiBerikutnya(periode.id, t);
      await periode.update({ status: 'Terpublikasi', published_at: sekarang }, { transaction: t });
      await KonflikLog.update({ is_resolved: true }, { where: { periode_id: periode.id, is_resolved: false }, transaction: t });

      const notifikasiDibuat = await notifikasiService.catatPublikasi({
        periode,
        versi,
        jumlahSesi: konflik.jumlahSesi,
        transaction: t,
      });

      return { periode: formatPeriode(periode, versi), versi, notifikasiDibuat, timestamp: sekarang.toISOString() };
    });

    if (keluaran.ditolak) {
      await sequelize.transaction((t) => sinkronKonflikLog(keluaran.periodeId, keluaran.konflik.daftar, t));
      throw new ErrorTerkontrol(
        409,
        `Publikasi ditolak: masih ditemukan ${keluaran.konflik.total} konflik hard constraint.`,
        { canPublish: false, totalKonflik: keluaran.konflik.total, daftarKonflik: keluaran.konflik.daftar }
      );
    }

    return res.json({
      sukses: true,
      pesan: `Jadwal perkuliahan berhasil dipublikasikan (${keluaran.versi}) untuk seluruh dosen dan mahasiswa.`,
      status: keluaran.periode.status,
      periode: keluaran.periode,
      versi: keluaran.versi,
      notifikasiDibuat: keluaran.notifikasiDibuat,
      timestamp: keluaran.timestamp,
    });
  } catch (err) {
    return tanganiError(err, res, next);
  }
};

// Dipakai constraintController untuk status pelanggaran dan hari off dosen.
exports.helpers = { resolvePeriode, hitungKonflik };