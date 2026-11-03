/**
 * Model Jadwal Kuliah (Sample / Demo Data untuk TI UMY)
 * Sesuai data wireframe dan PRD Kelompok 5
 */

const daftarJadwal = [
  {
    id: 1,
    jamMulai: '08:50',
    jamSelesai: '11:30',
    mataKuliah: 'Pengembangan Aplikasi Web',
    kodeMatkul: 'TI401',
    sks: 3,
    kelas: 'B',
    ruang: 'F6.003',
    dosen: 'Ir. Asroni, S.T., M.Eng.',
    hari: 'Senin',
    jenis: 'Teori & Praktik',
    isActiveNow: true,
    progressPercent: 68,
    menitSisa: 42,
  },
  {
    id: 2,
    jamMulai: '13:20',
    jamSelesai: '15:00',
    mataKuliah: 'Pengembangan Web Service',
    kodeMatkul: 'TI402',
    sks: 2,
    kelas: 'A',
    ruang: 'F6.003',
    dosen: 'Dr. Ir. Dwijoko Purbohadi, M.T.',
    hari: 'Senin',
    jenis: 'Teori',
    isActiveNow: false,
    progressPercent: 0,
    menitSisa: null,
  },
  {
    id: 3,
    jamMulai: '16:20',
    jamSelesai: '18:00',
    mataKuliah: 'WAN dan Teknologi Jaringan',
    kodeMatkul: 'TI403',
    sks: 2,
    kelas: 'C',
    ruang: 'F6.004',
    dosen: 'Ir. Eko Prasetyo, M.Eng., Ph.D.',
    hari: 'Senin',
    jenis: 'Laboratorium Jaringan',
    isActiveNow: false,
    progressPercent: 0,
    menitSisa: null,
  },
  {
    id: 4,
    jamMulai: '07:00',
    jamSelesai: '08:40',
    mataKuliah: 'Kecerdasan Buatan',
    kodeMatkul: 'TI404',
    sks: 2,
    kelas: 'A',
    ruang: 'F6.002',
    dosen: 'Dr. Ir. Dwijoko Purbohadi, M.T.',
    hari: 'Selasa',
    jenis: 'Teori',
    isActiveNow: false,
    progressPercent: 0,
    menitSisa: null,
  },
  {
    id: 5,
    jamMulai: '09:40',
    jamSelesai: '12:10',
    mataKuliah: 'Praktikum Basis Data Lanjut',
    kodeMatkul: 'TI405',
    sks: 3,
    kelas: 'B',
    ruang: 'Lab Komputasi F6',
    dosen: 'Ir. Asroni, S.T., M.Eng.',
    hari: 'Rabu',
    jenis: 'Praktikum Lab',
    isActiveNow: false,
    progressPercent: 0,
    menitSisa: null,
  },
  {
    id: 6,
    jamMulai: '13:00',
    jamSelesai: '15:30',
    mataKuliah: 'Keamanan Siber & Jaringan',
    kodeMatkul: 'TI406',
    sks: 3,
    kelas: 'A',
    ruang: 'Lab Cyber Security F6',
    dosen: 'Ir. Eko Prasetyo, M.Eng., Ph.D.',
    hari: 'Kamis',
    jenis: 'Praktikum Lab',
    isActiveNow: false,
    progressPercent: 0,
    menitSisa: null,
  },
];

const JadwalModel = {
  getAll() {
    return daftarJadwal;
  },
  getById(id) {
    const num = parseInt(id, 10);
    return daftarJadwal.find((j) => j.id === num) || null;
  },
  getActiveNow() {
    return daftarJadwal.find((j) => j.isActiveNow) || daftarJadwal[0];
  },
};

module.exports = JadwalModel;
