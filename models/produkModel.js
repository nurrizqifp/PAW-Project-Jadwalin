/**
 * Model Modul Sistem Jadwalin (PRD Bagian 6 - Fitur & Prioritas MoSCoW)
 * Mengelola daftar fitur inti sistem sesuai PRD.
 */

const daftarFiturPRD = [
  {
    id: 1,
    kode: 'F-01',
    nama: 'Kelola Data Master Akademik',
    kategori: 'Master Data',
    terkaitUS: 'US-01',
    prioritas: 'Must',
    deskripsi: 'Pengelolaan data 20 dosen, 45 mata kuliah, dan 8 ruangan (kelas teori & laboratorium) dengan validasi otomatis.',
    status: 'Tersedia',
  },
  {
    id: 2,
    kode: 'F-02',
    nama: 'Pengaturan Hard & Soft Constraint',
    kategori: 'Optimasi & Aturan',
    terkaitUS: 'US-02',
    prioritas: 'Must',
    deskripsi: 'Menjamin 0 bentrok dosen/ruangan dan 100% mata kuliah praktikum masuk ke laboratorium yang sesuai.',
    status: 'Tersedia',
  },
  {
    id: 3,
    kode: 'F-03',
    nama: 'Generate Jadwal Otomatis',
    kategori: 'Constraint Solver',
    terkaitUS: 'US-03',
    prioritas: 'Must',
    deskripsi: 'Penyusunan jadwal otomatis berbasis constraint solver dalam waktu kurang dari 15 menit.',
    status: 'Tersedia',
  },
  {
    id: 4,
    kode: 'F-04',
    nama: 'Laporan Konflik & Saran Perbaikan',
    kategori: 'Validasi',
    terkaitUS: 'US-03',
    prioritas: 'Must',
    deskripsi: 'Deteksi otomatis bentrok dan rekomendasi perbaikan sebelum jadwal dipublikasikan.',
    status: 'Tersedia',
  },
  {
    id: 5,
    kode: 'F-05',
    nama: 'Preview & Publikasi Jadwal',
    kategori: 'Distribusi',
    terkaitUS: 'US-04',
    prioritas: 'Must',
    deskripsi: 'Filter multi-dimensi per dosen, ruang, atau kelas sebelum jadwal berstatus Terpublikasi.',
    status: 'Tersedia',
  },
  {
    id: 6,
    kode: 'F-06',
    nama: 'Form Preferensi Waktu Dosen',
    kategori: 'Portal Dosen',
    terkaitUS: 'US-05',
    prioritas: 'Should',
    deskripsi: 'Pengisian preferensi hari dan jam mengajar dosen (seperti hari libur riset dosen).',
    status: 'Tersedia',
  },
  {
    id: 7,
    kode: 'F-07',
    nama: 'Lihat Jadwal Terpublikasi',
    kategori: 'Antarmuka Pengguna',
    terkaitUS: 'US-06, US-07',
    prioritas: 'Must',
    deskripsi: 'Akses jadwal akurat tanpa bentrok untuk mahasiswa dan dosen via web responsif.',
    status: 'Tersedia',
  },
  {
    id: 8,
    kode: 'F-08',
    nama: 'Notifikasi Perubahan Jadwal',
    kategori: 'Notifikasi',
    terkaitUS: 'US-06, US-08',
    prioritas: 'Should',
    deskripsi: 'Pemberitahuan real-time di sistem web saat terjadi pembaruan jadwal atau ruang.',
    status: 'Tersedia',
  },
];

const ProdukModel = {
  getAll() {
    return daftarFiturPRD;
  },
  getById(id) {
    const num = parseInt(id, 10);
    return daftarFiturPRD.find(f => f.id === num) || null;
  },
};

module.exports = ProdukModel;
