/**
 * services/notifikasiService.js
 * Service Notifikasi (PRD F-08, US-06, US-08)
 * Menyimpan notifikasi ke tabel `notifikasis` agar drawer membaca data riil dari database.
 *
 * Desain penerima:
 * - Tabel notifikasis hanya punya target_role + target_ref_id dan satu kolom is_read, sehingga status
 *   "sudah dibaca" tidak bisa dipisah per pengguna pada baris broadcast. Karena itu notifikasi untuk
 *   dosen dan mahasiswa dibuat per penerima (target_ref_id = id dosen / id mahasiswa),
 *   sedangkan staf akademik cukup satu baris target_role = 'admin'.
 * - Riwayat versi publikasi (v1.0, v1.1, dst) dicatat pada baris admin berjudul "... Terpublikasi (v1.N)".
 */
const { Op } = require('sequelize');
const db = require('../models');

const { Notifikasi, Mahasiswa, JadwalDosen, JadwalSesi } = db;

const potong = (teks, maks) => (String(teks).length > maks ? `${String(teks).slice(0, maks - 1)}…` : String(teks));

async function buatBanyak(baris, transaction) {
  if (baris.length === 0) return 0;
  await Notifikasi.bulkCreate(baris, { transaction });
  return baris.length;
}

/* ------------------------------------------------------------------ */
/* Pencatatan & penyebaran                                              */
/* ------------------------------------------------------------------ */

/**
 * Perubahan slot oleh staf akademik.
 * - Selalu mencatat satu baris untuk admin (jejak perubahan).
 * - Jika periode sudah Terpublikasi: dosen pengampu (termasuk team teaching) dan mahasiswa semester
 *   terkait ikut dinotifikasi (PRD US-06 & US-08). Draft belum terlihat civitas, jadi tidak disebarkan.
 */
async function catatPerubahanSlot({ periode, sesi, lama, baru, aktor, transaction }) {
  const judul = potong(`Perubahan Jadwal ${sesi.kodeMatkul}`, 150);
  const isi = `${sesi.mataKuliah} (Kelas ${sesi.kelas}) berubah dari ${lama} menjadi ${baru}.`;
  const dasar = { periode_id: periode.id, judul, isi, is_read: false };

  const baris = [
    { ...dasar, target_role: 'admin', target_ref_id: null, isi: aktor ? `${isi} Diubah oleh ${aktor}.` : isi },
  ];

  if (periode.status === 'Terpublikasi') {
    sesi.dosenList.forEach((d) => baris.push({ ...dasar, target_role: 'dosen', target_ref_id: d.id }));

    const kondisi = { semester_aktif: sesi.semester };
    if (sesi.isPilihan && sesi.peminatanKode) kondisi.kode_peminatan = sesi.peminatanKode;
    const mahasiswas = await Mahasiswa.findAll({ attributes: ['id'], where: kondisi, transaction });
    mahasiswas.forEach((m) => baris.push({ ...dasar, target_role: 'mahasiswa', target_ref_id: m.id }));
  }

  return buatBanyak(baris, transaction);
}

/** Publikasi jadwal: admin (1 baris), setiap dosen yang mengajar di periode, dan seluruh mahasiswa. */
async function catatPublikasi({ periode, versi, jumlahSesi, transaction }) {
  const judul = potong(`Jadwal ${periode.nama} Terpublikasi (${versi})`, 150);
  const isi = `Jadwal ${periode.nama} (${jumlahSesi} sesi) telah dipublikasikan dengan 0 bentrok dosen dan ruangan.`;
  const dasar = { periode_id: periode.id, judul, isi, is_read: false };

  const baris = [{ ...dasar, target_role: 'admin', target_ref_id: null }];

  const pivot = await JadwalDosen.findAll({
    attributes: ['dosen_id'],
    include: [{ model: JadwalSesi, as: 'jadwalSesi', attributes: [], required: true, where: { periode_id: periode.id } }],
    group: ['JadwalDosen.dosen_id'],
    raw: true,
    transaction,
  });
  pivot.forEach((p) => baris.push({ ...dasar, target_role: 'dosen', target_ref_id: p.dosen_id }));

  const mahasiswas = await Mahasiswa.findAll({ attributes: ['id'], transaction });
  mahasiswas.forEach((m) => baris.push({ ...dasar, target_role: 'mahasiswa', target_ref_id: m.id }));

  return buatBanyak(baris, transaction);
}

/** Preferensi dosen tersimpan: terlihat oleh staf akademik (US-05) dan dosen yang bersangkutan. */
async function catatPreferensi({ dosen, hariOff, alasan, transaction }) {
  const judul = potong(`Preferensi Dosen ${dosen.inisial || dosen.nama}`, 150);
  const isi = `Hari bebas mengajar ${hariOff} untuk ${dosen.nama} tercatat (${alasan}).`;
  return buatBanyak(
    [
      { judul, isi, target_role: 'admin', target_ref_id: null, is_read: false },
      { judul, isi, target_role: 'dosen', target_ref_id: dosen.id, is_read: false },
    ],
    transaction
  );
}

/* ------------------------------------------------------------------ */
/* Riwayat versi publikasi (v1.0, v1.1, dst)                            */
/* ------------------------------------------------------------------ */

const jumlahPublikasi = (periodeId, transaction) =>
  Notifikasi.count({
    where: { periode_id: periodeId, target_role: 'admin', judul: { [Op.like]: '%Terpublikasi (v1.%' } },
    transaction,
  });

async function versiPublikasiBerikutnya(periodeId, transaction) {
  return `v1.${await jumlahPublikasi(periodeId, transaction)}`;
}

async function versiPublikasiTerakhir(periodeId) {
  const jumlah = await jumlahPublikasi(periodeId);
  return jumlah > 0 ? `v1.${jumlah - 1}` : null;
}

/* ------------------------------------------------------------------ */
/* Pembacaan untuk drawer notifikasi                                    */
/* ------------------------------------------------------------------ */

function kondisiUntuk(pengguna) {
  const atau = [{ target_role: 'all' }];
  if (pengguna.role === 'admin') {
    atau.push({ target_role: 'admin' });
  } else {
    atau.push({
      target_role: pengguna.role,
      [Op.or]: [{ target_ref_id: null }, { target_ref_id: pengguna.refId ?? -1 }],
    });
  }
  return { [Op.or]: atau };
}

const labelWaktu = (tanggal) =>
  `${new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(tanggal))} WIB`;

function formatNotifikasi(n) {
  return {
    id: n.id,
    periodeId: n.periode_id,
    targetRole: n.target_role,
    judul: n.judul,
    isi: n.isi,
    isRead: n.is_read,
    dibuatPada: n.created_at || n.createdAt,
    waktu: labelWaktu(n.created_at || n.createdAt),
    // Alias agar kompatibel dengan bentuk lama (JadwalModel.getNotifikasi) yang dipakai drawer.
    mataKuliah: n.judul,
    perubahan: n.isi,
  };
}

async function daftarUntukPengguna({ pengguna, belumDibaca = false, limit = 50, periodeId }) {
  const where = { ...kondisiUntuk(pengguna) };
  if (belumDibaca) where.is_read = false;
  if (periodeId) where.periode_id = periodeId;

  const [rows, jumlahBelumDibaca] = await Promise.all([
    Notifikasi.findAll({ where, order: [['created_at', 'DESC'], ['id', 'DESC']], limit }),
    Notifikasi.count({ where: { ...kondisiUntuk(pengguna), is_read: false } }),
  ]);

  return { data: rows.map(formatNotifikasi), belumDibaca: jumlahBelumDibaca };
}

async function tandaiDibaca({ pengguna, id }) {
  const [jumlah] = await Notifikasi.update({ is_read: true }, { where: { id, ...kondisiUntuk(pengguna) } });
  return jumlah;
}

async function tandaiSemuaDibaca({ pengguna }) {
  const [jumlah] = await Notifikasi.update({ is_read: true }, { where: { is_read: false, ...kondisiUntuk(pengguna) } });
  return jumlah;
}

module.exports = {
  catatPerubahanSlot,
  catatPublikasi,
  catatPreferensi,
  versiPublikasiBerikutnya,
  versiPublikasiTerakhir,
  daftarUntukPengguna,
  tandaiDibaca,
  tandaiSemuaDibaca,
};