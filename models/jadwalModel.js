/**
 * Model Jadwal Kuliah (PRD F-03, F-04, F-05, F-07)
 * Memuat jadwal kuliah hasil generate AI bebas bentrok (0 bentrok) dan terpublikasi.
 */

let statusJadwal = 'Terpublikasi';
let lastGeneratedAt = new Date().toISOString();
let totalKonflik = 0;

const jadwalKuliah = [
  {
    id: 1,
    hari: 'Senin',
    jamMulai: '08:50',
    jamSelesai: '11:30',
    kodeMatkul: 'TI401',
    mataKuliah: 'Pengembangan Aplikasi Web',
    sks: 3,
    kelas: 'B',
    ruang: 'F6.003',
    dosen: 'Ir. Asroni, S.T., M.Eng.',
    jenis: 'Teori & Praktik',
    isActiveNow: true,
    progressPercent: 68,
    isLabValid: true,
  },
  {
    id: 2,
    hari: 'Senin',
    jamMulai: '13:20',
    jamSelesai: '15:00',
    kodeMatkul: 'TI402',
    mataKuliah: 'Pengembangan Web Service',
    sks: 2,
    kelas: 'A',
    ruang: 'F6.003',
    dosen: 'Dr. Ir. Dwijoko Purbohadi, M.T.',
    jenis: 'Teori',
    isActiveNow: false,
    progressPercent: 0,
    isLabValid: true,
  },
  {
    id: 3,
    hari: 'Senin',
    jamMulai: '16:20',
    jamSelesai: '18:00',
    kodeMatkul: 'TI403',
    mataKuliah: 'WAN dan Teknologi Jaringan',
    sks: 2,
    kelas: 'C',
    ruang: 'Lab.Net (F6.004)',
    dosen: 'Ir. Eko Prasetyo, M.Eng., Ph.D.',
    jenis: 'Praktikum',
    isActiveNow: false,
    progressPercent: 0,
    isLabValid: true,
  },
  {
    id: 4,
    hari: 'Selasa',
    jamMulai: '07:00',
    jamSelesai: '08:40',
    kodeMatkul: 'TI404',
    mataKuliah: 'Kecerdasan Buatan',
    sks: 2,
    kelas: 'A',
    ruang: 'F6.002',
    dosen: 'Dr. Budi Santoso, S.Kom., M.Cs.',
    jenis: 'Teori',
    isActiveNow: false,
    progressPercent: 0,
    isLabValid: true,
  },
  {
    id: 5,
    hari: 'Rabu',
    jamMulai: '09:40',
    jamSelesai: '12:10',
    kodeMatkul: 'TI405',
    mataKuliah: 'Praktikum Basis Data Lanjut',
    sks: 3,
    kelas: 'B',
    ruang: 'Lab.Kom',
    dosen: 'Siti Aminah, S.Kom., M.Kom.',
    jenis: 'Praktikum',
    isActiveNow: false,
    progressPercent: 0,
    isLabValid: true,
  },
  {
    id: 6,
    hari: 'Kamis',
    jamMulai: '13:00',
    jamSelesai: '15:30',
    kodeMatkul: 'TI406',
    mataKuliah: 'Keamanan Siber & Jaringan',
    sks: 3,
    kelas: 'A',
    ruang: 'Lab.Cyber',
    dosen: 'Ir. Eko Prasetyo, M.Eng., Ph.D.',
    jenis: 'Praktikum',
    isActiveNow: false,
    progressPercent: 0,
    isLabValid: true,
  },
];

const JadwalModel = {
  getAll() {
    return jadwalKuliah;
  },
  getByDosen(dosenNama) {
    if (!dosenNama) return jadwalKuliah;
    return jadwalKuliah.filter(j => j.dosen.toLowerCase().includes(dosenNama.toLowerCase()));
  },
  getByRuang(ruangKode) {
    if (!ruangKode) return jadwalKuliah;
    return jadwalKuliah.filter(j => j.ruang.toLowerCase().includes(ruangKode.toLowerCase()));
  },
  getByKelas(kelas) {
    if (!kelas) return jadwalKuliah;
    return jadwalKuliah.filter(j => j.kelas.toLowerCase() === kelas.toLowerCase());
  },
  getStatus() {
    return {
      status: statusJadwal,
      totalKonflik,
      lastGeneratedAt,
      totalSesi: jadwalKuliah.length,
      zeroClashConfirmed: totalKonflik === 0,
    };
  },
  publish() {
    statusJadwal = 'Terpublikasi';
    return { status: statusJadwal, timestamp: new Date().toISOString() };
  },
  generateAI() {
    // Simulasi solver constraint AI: 0 bentrok, 100% lab matching
    statusJadwal = 'Terpublikasi';
    lastGeneratedAt = new Date().toISOString();
    totalKonflik = 0;
    return {
      success: true,
      message: 'Jadwal berhasil disusun secara otomatis oleh AI dalam 1.2 detik (Target < 15 menit).',
      totalKonflik: 0,
      labMatching: '100% Sesuai',
      kepuasanDosen: '88.5%',
      status: statusJadwal,
      timestamp: lastGeneratedAt,
    };
  },
};

module.exports = JadwalModel;
