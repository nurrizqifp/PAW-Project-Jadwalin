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
    kelas: 'B',
    ruang: 'F6.003',
    dosen: 'Ir. Asroni, S.T., M.Eng.',
    hari: 'Senin',
    jenis: 'Teori & Praktik',
  },
  {
    id: 2,
    jamMulai: '13:20',
    jamSelesai: '15:00',
    mataKuliah: 'Pengembangan Web Service',
    kelas: 'A',
    ruang: 'F6.003',
    dosen: 'Dr. Ir. Dwijoko Purbohadi, M.T.',
    hari: 'Senin',
    jenis: 'Teori',
  },
  {
    id: 3,
    jamMulai: '16:20',
    jamSelesai: '18:00',
    mataKuliah: 'WAN dan Teknologi Jaringan',
    kelas: 'C',
    ruang: 'F6.004',
    dosen: 'Ir. Eko Prasetyo, M.Eng., Ph.D.',
    hari: 'Senin',
    jenis: 'Laboratorium Jaringan',
  },
  {
    id: 4,
    jamMulai: '07:00',
    jamSelesai: '08:40',
    mataKuliah: 'Kecerdasan Buatan',
    kelas: 'A',
    ruang: 'F6.002',
    dosen: 'Dr. Ir. Dwijoko Purbohadi, M.T.',
    hari: 'Selasa',
    jenis: 'Teori',
  },
  {
    id: 5,
    jamMulai: '09:40',
    jamSelesai: '12:10',
    mataKuliah: 'Praktikum Basis Data Lanjut',
    kelas: 'B',
    ruang: 'Lab Komputasi F6',
    dosen: 'Ir. Asroni, S.T., M.Eng.',
    hari: 'Rabu',
    jenis: 'Praktikum Lab',
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
};

module.exports = JadwalModel;
