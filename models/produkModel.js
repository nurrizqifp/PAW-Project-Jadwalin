/**
 * Model Produk / Modul Layanan Jadwalin
 * Mengelola data dan operasi yang berkaitan dengan data produk.
 * Saat ini menggunakan array statis in-memory tanpa database wajib.
 */

const daftarProduk = [
  {
    id: 1,
    nama: 'AI Auto-Scheduler Core',
    kategori: 'Core AI Engine',
    kategoriSlug: 'ai-engine',
    deskripsi: 'Mesin AI untuk penyusunan jadwal kuliah otomatis dalam hitungan menit (<15 menit) dengan garansi 0 bentrok dosen dan ruangan.',
    harga: 2500000,
    stok: 10,
    fiturUtama: 'Constraint satisfaction algorithm, zero clash guarantee, batch optimizer',
    badge: 'Paling Populer',
    badgeColor: 'amber',
    icon: 'sparkles',
    rating: 4.9,
    terjual: '14x semester',
  },
  {
    id: 2,
    nama: 'Academic Master Data Manager',
    kategori: 'Manajemen Data',
    kategoriSlug: 'master-data',
    deskripsi: 'Modul pengelolaan data terpadu untuk 20+ dosen, 45+ mata kuliah, dan 8+ ruangan (kelas teori & laboratorium praktikum).',
    harga: 850000,
    stok: 25,
    fiturUtama: 'Validasi otomatis kolom kosong, pencarian instan, klasifikasi ruang',
    badge: 'Esensial',
    badgeColor: 'blue',
    icon: 'database',
    rating: 4.8,
    terjual: '28x prodi',
  },
  {
    id: 3,
    nama: 'Constraint & Lab-Matching Solver',
    kategori: 'Optimasi Jadwal',
    kategoriSlug: 'optimizer',
    deskripsi: 'Sistem pengaturan hard constraint (anti-bentrok & 100% praktikum di lab) serta soft constraint preferensi waktu mengajar dosen.',
    harga: 1200000,
    stok: 15,
    fiturUtama: 'Hard & soft constraints, 100% lab matching, prioritas riset dosen',
    badge: 'Rekomendasi',
    badgeColor: 'emerald',
    icon: 'sliders',
    rating: 5.0,
    terjual: '19x semester',
  },
  {
    id: 4,
    nama: 'Interactive Schedule Preview & Publisher',
    kategori: 'Distribusi Jadwal',
    kategoriSlug: 'publisher',
    deskripsi: 'Antarmuka preview jadwal dengan filter interaktif per dosen, ruang kelas, atau angkatan sebelum dipublikasikan ke civitas prodi.',
    harga: 750000,
    stok: 30,
    fiturUtama: 'Filter multi-parameter, publikasi satu klik, ekspor PDF/Excel',
    badge: 'Produktivitas',
    badgeColor: 'indigo',
    icon: 'eye',
    rating: 4.7,
    terjual: '32x semester',
  },
  {
    id: 5,
    nama: 'Lecturer Preference Portal',
    kategori: 'Portal Dosen',
    kategoriSlug: 'portal',
    deskripsi: 'Portal mandiri bagi dosen untuk mengisi ketersediaan mengajar, hari libur riset, dan preferensi jam dengan kepuasan target >=85%.',
    harga: 650000,
    stok: 20,
    fiturUtama: 'Form interaktif, sinkronisasi otomatis ke scheduler, fleksibilitas riset',
    badge: 'Kolaborasi',
    badgeColor: 'purple',
    icon: 'calendar',
    rating: 4.9,
    terjual: '22x semester',
  },
  {
    id: 6,
    nama: 'Real-time Web Alert & Change Notifier',
    kategori: 'Komunikasi',
    kategoriSlug: 'notifier',
    deskripsi: 'Layanan notifikasi perubahan jadwal secara real-time di antarmuka web mahasiswa dan dosen saat terjadi pembaruan mendadak.',
    harga: 500000,
    stok: 50,
    fiturUtama: 'Pemberitahuan instan, histori perubahan jadwal, audit log',
    badge: 'Real-time',
    badgeColor: 'rose',
    icon: 'bell',
    rating: 4.8,
    terjual: '45x prodi',
  },
];

const ProdukModel = {
  /**
   * Mengambil semua produk / modul layanan
   * @returns {Array} daftar produk
   */
  getAll() {
    return daftarProduk;
  },

  /**
   * Mencari produk berdasarkan ID
   * @param {number|string} id 
   * @returns {Object|null}
   */
  getById(id) {
    const numericId = parseInt(id, 10);
    return daftarProduk.find((item) => item.id === numericId) || null;
  },

  /**
   * Mengambil produk berdasarkan kategori
   * @param {string} kategori 
   * @returns {Array}
   */
  getByKategori(kategori) {
    if (!kategori) return daftarProduk;
    return daftarProduk.filter(
      (item) => item.kategori.toLowerCase() === kategori.toLowerCase()
    );
  },
};

module.exports = ProdukModel;
