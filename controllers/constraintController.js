/**
 * controllers/constraintController.js
 * Controller Constraint (PRD F-02, F-06, US-02, US-05)
 *   GET  /api/constraints             - hard constraint + preferensi dosen (soft) dari database
 *   POST /api/constraints/hard        - aktif/nonaktifkan hard constraint
 *   POST /api/constraints/preferensi  - simpan preferensi hari bebas mengajar dosen
 */
const { z } = require('zod');
const { Op } = require('sequelize');
const db = require('../models');
const jadwalController = require('./jadwalController');
const notifikasiService = require('../services/notifikasiService');

const { sequelize, ConstraintHard, ConstraintSoft, Dosen, JadwalDosen, JadwalSesi } = db;
const { resolvePeriode, hitungKonflik } = jadwalController.helpers;

const hardConstraintSchema = z.object({
  id: z.enum(['HC-01', 'HC-02', 'HC-03', 'LAB-MATCH'], { message: 'Kode hard constraint tidak valid' }),
  isActive: z.boolean({ message: 'isActive wajib boolean' }),
});

const preferensiSchema = z.object({
  dosenNama: z.string().trim().min(3, 'Nama dosen wajib diisi').max(150),
  hariOff: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'], { message: 'Hari bebas mengajar tidak valid' }),
  alasan: z.string().trim().min(3, 'Alasan wajib diisi').max(200),
});

const escapeLike = (teks) => String(teks).replace(/[\\%_]/g, '\\$&');

async function ambilStatusPelanggaran() {
  const periode = await resolvePeriode({ isAdmin: true });
  if (!periode) return { perKode: {}, ringkasan: { bentrokDosenRuangan: 0, labMatchingPercent: 100 } };
  const hasil = await hitungKonflik(periode.id);
  const perKode = {};
  hasil.daftar.forEach((k) => {
    perKode[k.kode] = (perKode[k.kode] || 0) + 1;
  });
  return { perKode, ringkasan: hasil.ringkasan };
}

/** Apakah dosen masih punya sesi di hari tertentu pada periode aktif (menentukan status preferensi). */
async function masihMengajarDiHari(dosenId, hari) {
  const periode = await resolvePeriode({ isAdmin: true });
  if (!periode) return false;
  const jumlah = await JadwalDosen.count({
    where: { dosen_id: dosenId },
    include: [{ model: JadwalSesi, as: 'jadwalSesi', required: true, where: { periode_id: periode.id, hari } }],
  });
  return jumlah > 0;
}

exports.daftar = async (req, res, next) => {
  try {
    const [hards, softs, { perKode, ringkasan }] = await Promise.all([
      ConstraintHard.findAll({ order: [['id', 'ASC']] }),
      ConstraintSoft.findAll({ include: [{ model: Dosen, as: 'dosen' }], order: [['id', 'ASC']] }),
      ambilStatusPelanggaran(),
    ]);

    const hardConstraints = hards.map((h) => {
      const pelanggaran = perKode[h.kode] || 0;
      return {
        id: h.kode,
        nama: h.nama,
        deskripsi: h.deskripsi,
        isActive: h.is_active,
        pelanggaran,
        status: !h.is_active ? 'Nonaktif (Peringatan)' : pelanggaran === 0 ? 'Terpenuhi (0 Pelanggaran)' : `${pelanggaran} Pelanggaran`,
      };
    });

    const softConstraints = softs.map((s) => ({
      id: `SC-${String(s.id).padStart(2, '0')}`,
      dosenId: s.dosen_id,
      dosenNama: s.dosen ? s.dosen.nama : null,
      dosenInisial: s.dosen ? s.dosen.inisial : null,
      hariOff: s.hari_off,
      preferensiWaktu: s.preferensi_waktu,
      alasan: s.alasan,
      isAccommodated: s.is_accommodated,
      status: s.is_accommodated ? 'Terakomodir' : 'Menunggu Generate',
    }));

    const terakomodasi = softs.filter((s) => s.is_accommodated).length;
    return res.json({
      sukses: true,
      data: {
        hardConstraints,
        softConstraints,
        metrics: {
          bentrokDosenRuangan: ringkasan.bentrokDosenRuangan,
          labMatchingPercent: `${ringkasan.labMatchingPercent}%`,
          kepuasanDosenPercent: softs.length ? `${Math.round((terakomodasi / softs.length) * 1000) / 10}%` : '100%',
        },
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.toggleHard = async (req, res, next) => {
  try {
    const parsed = hardConstraintSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ sukses: false, pesan: parsed.error.issues[0]?.message || 'Parameter hard constraint tidak valid.' });
    }

    const hc = await ConstraintHard.findOne({ where: { kode: parsed.data.id } });
    if (!hc) {
      return res.status(404).json({ sukses: false, pesan: `Hard constraint ${parsed.data.id} tidak ditemukan.` });
    }
    await hc.update({ is_active: parsed.data.isActive });

    return res.json({
      sukses: true,
      pesan: `Aturan ${hc.nama} ${hc.is_active ? 'diaktifkan' : 'dinonaktifkan'}.`,
      constraint: {
        id: hc.kode,
        nama: hc.nama,
        deskripsi: hc.deskripsi,
        isActive: hc.is_active,
        status: hc.is_active ? 'Aktif' : 'Nonaktif (Peringatan)',
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.simpanPreferensi = async (req, res, next) => {
  try {
    const parsed = preferensiSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ sukses: false, pesan: parsed.error.issues[0]?.message || 'Data preferensi dosen tidak valid.' });
    }
    const { dosenNama, hariOff, alasan } = parsed.data;

    const dosen = await Dosen.findOne({ where: { nama: { [Op.iLike]: escapeLike(dosenNama) } } });
    if (!dosen) {
      return res.status(404).json({ sukses: false, pesan: `Dosen '${dosenNama}' tidak ditemukan.` });
    }

    // Dosen hanya boleh mengubah preferensinya sendiri; staf akademik boleh mengisi sementara (PRD F-06).
    if (req.user.role === 'dosen' && req.user.refId !== dosen.id) {
      return res.status(403).json({ sukses: false, pesan: 'Dosen hanya dapat mengubah preferensi miliknya sendiri.' });
    }

    // Terakomodir bila dosen belum punya sesi di hari tersebut pada jadwal periode aktif.
    const terakomodasi = !(await masihMengajarDiHari(dosen.id, hariOff));

    const { soft, notifikasiDibuat } = await sequelize.transaction(async (t) => {
      const [row] = await ConstraintSoft.findOrCreate({
        where: { dosen_id: dosen.id },
        defaults: { hari_off: hariOff, alasan, is_accommodated: terakomodasi },
        transaction: t,
      });
      await row.update({ hari_off: hariOff, alasan, is_accommodated: terakomodasi }, { transaction: t });
      const dibuat = await notifikasiService.catatPreferensi({ dosen, hariOff, alasan, transaction: t });
      return { soft: row, notifikasiDibuat: dibuat };
    });

    return res.json({
      sukses: true,
      pesan: `Preferensi hari bebas mengajar (${hariOff}) untuk ${dosen.nama} berhasil disimpan.`,
      preferensi: {
        dosenId: dosen.id,
        dosenNama: dosen.nama,
        hariOff: soft.hari_off,
        alasan: soft.alasan,
        isAccommodated: soft.is_accommodated,
        status: soft.is_accommodated ? 'Terakomodir' : 'Menunggu Generate',
      },
      notifikasiDibuat,
    });
  } catch (err) {
    return next(err);
  }
};