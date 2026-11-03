/**
 * Model Constraint & Preferensi (PRD F-02, US-02, US-05)
 * Hard Constraints (wajib terpenuhi 100%) dan Soft Constraints (preferensi dosen >=85%).
 */

const initialConstraints = {
  hardConstraints: [
    {
      id: 'HC-01',
      nama: 'Zero Clash Dosen',
      deskripsi: 'Dosen tidak boleh mengajar dua kelas berbeda pada slot waktu yang bersamaan.',
      isActive: true,
      status: 'Terpenuhi (0 Pelanggaran)',
    },
    {
      id: 'HC-02',
      nama: 'Zero Clash Ruangan',
      deskripsi: 'Ruangan teori maupun laboratorium tidak boleh digunakan lebih dari satu kelas pada waktu yang sama.',
      isActive: true,
      status: 'Terpenuhi (0 Pelanggaran)',
    },
    {
      id: 'HC-03',
      nama: 'Lab Matching 100%',
      deskripsi: 'Mata kuliah praktikum wajib 100% dialokasikan ke laboratorium komputer yang sesuai.',
      isActive: true,
      status: 'Terpenuhi (100% Sesuai)',
    },
  ],
  softConstraints: [
    {
      id: 'SC-01',
      dosenId: 4,
      dosenNama: 'Dr. Budi Santoso, S.Kom., M.Cs.',
      hariOff: 'Jumat',
      alasan: 'Alokasi Waktu Riset & Penelitian Laboratorium',
      isAccommodated: true,
      status: 'Terakomodir',
    },
    {
      id: 'SC-02',
      dosenId: 2,
      dosenNama: 'Dr. Ir. Dwijoko Purbohadi, M.T.',
      hariOff: 'Kamis',
      alasan: 'Bimbingan Pascasarjana',
      isAccommodated: true,
      status: 'Terakomodir',
    },
    {
      id: 'SC-03',
      dosenId: 1,
      dosenNama: 'Ir. Asroni, S.T., M.Eng.',
      preferensiWaktu: 'Pagi & Siang (07:00 - 15:00)',
      isAccommodated: true,
      status: 'Terakomodir',
    },
  ],
  metrics: {
    waktuGenerate: '1.2 detik (Target < 15 menit)',
    bentrokDosenRuangan: 0,
    labMatchingPercent: '100%',
    kepuasanDosenPercent: '88.5% (Target >= 85%)',
  },
};

const ConstraintModel = {
  getAll() {
    return initialConstraints;
  },
  getMetrics() {
    return initialConstraints.metrics;
  },
  updateDosenPreference(dosenNama, hariOff, alasan) {
    const existing = initialConstraints.softConstraints.find(sc => sc.dosenNama === dosenNama);
    if (existing) {
      existing.hariOff = hariOff;
      existing.alasan = alasan;
    } else {
      initialConstraints.softConstraints.push({
        id: `SC-0${initialConstraints.softConstraints.length + 1}`,
        dosenNama,
        hariOff,
        alasan,
        isAccommodated: true,
        status: 'Terakomodir',
      });
    }
    return initialConstraints.softConstraints;
  },
};

module.exports = ConstraintModel;

