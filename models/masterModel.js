/**
 * Model Data Master Akademik (PRD F-01 & US-01)
 * Mengelola 20 Dosen, 45 Mata Kuliah, dan 8 Ruangan (Teori & Laboratorium).
 */

const daftarDosen = [
  { id: 1, nidn: '0512017801', nama: 'Ir. Asroni, S.T., M.Eng.', keahlian: 'Rekayasa Web & Komputasi', bebanSks: 9 },
  { id: 2, nidn: '0515088202', nama: 'Dr. Ir. Dwijoko Purbohadi, M.T.', keahlian: 'Arsitektur Perangkat Lunak', bebanSks: 8 },
  { id: 3, nidn: '0520038503', nama: 'Ir. Eko Prasetyo, M.Eng., Ph.D.', keahlian: 'Jaringan Komputer & Cyber Security', bebanSks: 10 },
  { id: 4, nidn: '0511048604', nama: 'Dr. Budi Santoso, S.Kom., M.Cs.', keahlian: 'Kecerdasan Buatan & Data Science', bebanSks: 8 },
  { id: 5, nidn: '0502098805', nama: 'Rina Wulandari, S.T., M.Eng.', keahlian: 'Sistem Informasi Akademik', bebanSks: 6 },
  { id: 6, nidn: '0514068906', nama: 'Hendra Setiawan, S.T., M.T.', keahlian: 'Pemrograman Bergerak', bebanSks: 9 },
  { id: 7, nidn: '0525118707', nama: 'Siti Aminah, S.Kom., M.Kom.', keahlian: 'Basis Data Lanjut', bebanSks: 9 },
  { id: 8, nidn: '0518048408', nama: 'Ahmad Fauzi, S.T., M.Eng.', keahlian: 'Cloud Computing & DevOps', bebanSks: 9 },
  { id: 9, nidn: '0509078909', nama: 'Nurul Hidayah, S.Kom., M.T.', keahlian: 'UI/UX & Human Computer Interaction', bebanSks: 6 },
  { id: 10, nidn: '0522039010', nama: 'Bambang Sudarsono, M.Kom.', keahlian: 'Sistem Operasi', bebanSks: 8 },
  { id: 11, nidn: '0517059111', nama: 'Dian Permatasari, M.Cs.', keahlian: 'Machine Learning', bebanSks: 8 },
  { id: 12, nidn: '0529088612', nama: 'Fajar Nugroho, S.T., M.Eng.', keahlian: 'Internet of Things', bebanSks: 9 },
  { id: 13, nidn: '0506128513', nama: 'Ratna Dewi, S.Kom., M.T.', keahlian: 'Struktur Data & Algoritma', bebanSks: 9 },
  { id: 14, nidn: '0519098914', nama: 'Yusuf Maulana, M.Eng.', keahlian: 'Kriptografi & Keamanan Informasi', bebanSks: 8 },
  { id: 15, nidn: '0503028815', nama: 'Dewi Lestari, S.T., M.Cs.', keahlian: 'Pemrosesan Bahasa Alami', bebanSks: 8 },
  { id: 16, nidn: '0528048716', nama: 'Agus Triyono, S.Kom., M.Kom.', keahlian: 'Etika Profesi & Manajemen Proyek', bebanSks: 6 },
  { id: 17, nidn: '0516089017', nama: 'Mega Wulandari, S.T., M.Eng.', keahlian: 'Interaksi Komputer Manusia', bebanSks: 8 },
  { id: 18, nidn: '0524058918', nama: 'Rizki Pratama, M.Kom.', keahlian: 'Jaringan Nirkabel & Sensor', bebanSks: 8 },
  { id: 19, nidn: '0507119119', nama: 'Anisa Rahmawati, S.Kom., M.Cs.', keahlian: 'Visi Komputer', bebanSks: 6 },
  { id: 20, nidn: '0512108820', nama: 'Tri Haryanto, S.T., M.T.', keahlian: 'Rekayasa Kebutuhan Perangkat Lunak', bebanSks: 8 },
];

const daftarRuangan = [
  { id: 1, kode: 'F6.002', nama: 'Ruang Teori F6.002', kapasitas: 45, jenis: 'Kelas Teori' },
  { id: 2, kode: 'F6.003', nama: 'Ruang Teori F6.003', kapasitas: 45, jenis: 'Kelas Teori' },
  { id: 3, kode: 'F6.004', nama: 'Ruang Teori F6.004', kapasitas: 40, jenis: 'Kelas Teori' },
  { id: 4, kode: 'F6.005', nama: 'Ruang Teori F6.005', kapasitas: 40, jenis: 'Kelas Teori' },
  { id: 5, kode: 'Lab.Kom', nama: 'Laboratorium Komputasi F6', kapasitas: 35, jenis: 'Laboratorium' },
  { id: 6, kode: 'Lab.Net', nama: 'Laboratorium Jaringan & WAN', kapasitas: 35, jenis: 'Laboratorium' },
  { id: 7, kode: 'Lab.Cyber', nama: 'Laboratorium Cyber Security', kapasitas: 35, jenis: 'Laboratorium' },
  { id: 8, kode: 'Lab.RPL', nama: 'Laboratorium Rekayasa Perangkat Lunak', kapasitas: 35, jenis: 'Laboratorium' },
];

const daftarMataKuliah = [
  { id: 1, kode: 'TI401', nama: 'Pengembangan Aplikasi Web', sks: 3, semester: 4, jenis: 'Teori & Praktik', butuhLab: true },
  { id: 2, kode: 'TI402', nama: 'Pengembangan Web Service', sks: 2, semester: 4, jenis: 'Teori', butuhLab: false },
  { id: 3, kode: 'TI403', nama: 'WAN dan Teknologi Jaringan', sks: 2, semester: 4, jenis: 'Praktikum', butuhLab: true },
  { id: 4, kode: 'TI404', nama: 'Kecerdasan Buatan', sks: 2, semester: 4, jenis: 'Teori', butuhLab: false },
  { id: 5, kode: 'TI405', nama: 'Praktikum Basis Data Lanjut', sks: 3, semester: 4, jenis: 'Praktikum', butuhLab: true },
  { id: 6, kode: 'TI406', nama: 'Keamanan Siber & Jaringan', sks: 3, semester: 6, jenis: 'Praktikum', butuhLab: true },
  { id: 7, kode: 'TI407', nama: 'Machine Learning', sks: 3, semester: 6, jenis: 'Praktikum', butuhLab: true },
  { id: 8, kode: 'TI408', nama: 'Cloud Computing & DevOps', sks: 3, semester: 6, jenis: 'Praktikum', butuhLab: true },
  { id: 9, kode: 'TI409', nama: 'Pemrograman Bergerak', sks: 3, semester: 6, jenis: 'Praktikum', butuhLab: true },
  { id: 10, kode: 'TI410', nama: 'Rekayasa Perangkat Lunak', sks: 3, semester: 4, jenis: 'Teori', butuhLab: false },
  { id: 11, kode: 'TI411', nama: 'Struktur Data & Algoritma', sks: 3, semester: 2, jenis: 'Praktikum', butuhLab: true },
  { id: 12, kode: 'TI412', nama: 'Sistem Operasi', sks: 3, semester: 2, jenis: 'Praktikum', butuhLab: true },
  { id: 13, kode: 'TI413', nama: 'Jaringan Komputer Dasar', sks: 3, semester: 2, jenis: 'Praktikum', butuhLab: true },
  { id: 14, kode: 'TI414', nama: 'Matematika Diskrit', sks: 2, semester: 2, jenis: 'Teori', butuhLab: false },
  { id: 15, kode: 'TI415', nama: 'Arsitektur Komputer', sks: 2, semester: 2, jenis: 'Teori', butuhLab: false },
  { id: 16, kode: 'TI416', nama: 'Etika Profesi TI', sks: 2, semester: 6, jenis: 'Teori', butuhLab: false },
  { id: 17, kode: 'TI417', nama: 'Manajemen Proyek TI', sks: 2, semester: 6, jenis: 'Teori', butuhLab: false },
  { id: 18, kode: 'TI418', nama: 'Interaksi Manusia & Komputer', sks: 2, semester: 4, jenis: 'Teori', butuhLab: false },
  { id: 19, kode: 'TI419', nama: 'Internet of Things', sks: 3, semester: 6, jenis: 'Praktikum', butuhLab: true },
  { id: 20, kode: 'TI420', nama: 'Kriptografi Terapan', sks: 2, semester: 6, jenis: 'Teori', butuhLab: false },
  { id: 21, kode: 'TI421', nama: 'Sistem Terdistribusi', sks: 3, semester: 6, jenis: 'Teori', butuhLab: false },
  { id: 22, kode: 'TI422', nama: 'Pengolahan Citra Digital', sks: 3, semester: 6, jenis: 'Praktikum', butuhLab: true },
  { id: 23, kode: 'TI423', nama: 'Pemrograman Python untuk AI', sks: 3, semester: 4, jenis: 'Praktikum', butuhLab: true },
  { id: 24, kode: 'TI424', nama: 'Pemrograman Web Lanjut', sks: 3, semester: 6, jenis: 'Praktikum', butuhLab: true },
  { id: 25, kode: 'TI425', nama: 'Administrasi Server & Jaringan', sks: 3, semester: 4, jenis: 'Praktikum', butuhLab: true },
  { id: 26, kode: 'TI426', nama: 'Statistika & Probabilitas', sks: 2, semester: 2, jenis: 'Teori', butuhLab: false },
  { id: 27, kode: 'TI427', nama: 'Kalkulus Informatika', sks: 2, semester: 2, jenis: 'Teori', butuhLab: false },
  { id: 28, kode: 'TI428', nama: 'Aljabar Linier', sks: 2, semester: 2, jenis: 'Teori', butuhLab: false },
  { id: 29, kode: 'TI429', nama: 'Basis Data Dasar', sks: 3, semester: 2, jenis: 'Praktikum', butuhLab: true },
  { id: 30, kode: 'TI430', nama: 'Algoritma & Pemrograman 1', sks: 3, semester: 1, jenis: 'Praktikum', butuhLab: true },
  { id: 31, kode: 'TI431', nama: 'Algoritma & Pemrograman 2', sks: 3, semester: 2, jenis: 'Praktikum', butuhLab: true },
  { id: 32, kode: 'TI432', nama: 'Pengantar Teknologi Informasi', sks: 2, semester: 1, jenis: 'Teori', butuhLab: false },
  { id: 33, kode: 'TI433', nama: 'Logika Matematika', sks: 2, semester: 1, jenis: 'Teori', butuhLab: false },
  { id: 34, kode: 'TI434', nama: 'Bahasa Inggris untuk TI', sks: 2, semester: 1, jenis: 'Teori', butuhLab: false },
  { id: 35, kode: 'TI435', nama: 'Kewirausahaan Berbasis Teknologi', sks: 2, semester: 6, jenis: 'Teori', butuhLab: false },
  { id: 36, kode: 'TI436', nama: 'Metodologi Penelitian TI', sks: 2, semester: 6, jenis: 'Teori', butuhLab: false },
  { id: 37, kode: 'TI437', nama: 'Data Warehouse & Mining', sks: 3, semester: 6, jenis: 'Praktikum', butuhLab: true },
  { id: 38, kode: 'TI438', nama: 'Big Data Analytics', sks: 3, semester: 6, jenis: 'Praktikum', butuhLab: true },
  { id: 39, kode: 'TI439', nama: 'Pengujian Perangkat Lunak', sks: 2, semester: 4, jenis: 'Teori', butuhLab: false },
  { id: 40, kode: 'TI440', nama: 'Analisis dan Desain Sistem', sks: 3, semester: 4, jenis: 'Teori', butuhLab: false },
  { id: 41, kode: 'TI441', nama: 'Pemodelan Perangkat Lunak', sks: 2, semester: 4, jenis: 'Teori', butuhLab: false },
  { id: 42, kode: 'TI442', nama: 'Forensik Digital', sks: 3, semester: 6, jenis: 'Praktikum', butuhLab: true },
  { id: 43, kode: 'TI443', nama: 'Audit Sistem Informasi', sks: 2, semester: 6, jenis: 'Teori', butuhLab: false },
  { id: 44, kode: 'TI444', nama: 'Proyek Komputasi Terapan', sks: 3, semester: 6, jenis: 'Praktikum', butuhLab: true },
  { id: 45, kode: 'TI445', nama: 'Kapita Selekta TI', sks: 2, semester: 6, jenis: 'Teori', butuhLab: false },
];

const MasterModel = {
  getDosen() {
    return daftarDosen;
  },
  getRuangan() {
    return daftarRuangan;
  },
  getMataKuliah() {
    return daftarMataKuliah;
  },
  getSummary() {
    return {
      totalDosen: daftarDosen.length,
      totalMatkul: daftarMataKuliah.length,
      totalRuangan: daftarRuangan.length,
      ruangLab: daftarRuangan.filter((r) => r.jenis === 'Laboratorium').length,
      ruangTeori: daftarRuangan.filter((r) => r.jenis === 'Kelas Teori').length,
    };
  },
};

module.exports = MasterModel;

