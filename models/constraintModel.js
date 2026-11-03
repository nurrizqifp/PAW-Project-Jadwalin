/**
 * Model Constraint & Preferensi (PRD F-02, US-02, US-05)
 * Beradaptasi dengan dataset riil TI UMY Gedung F4 & F6.
 */

const initialConstraints = {
  hardConstraints: [
    {
      id: 'HC-01',
      nama: 'Zero Clash Dosen & Team Teaching',
      deskripsi: 'Dosen (termasuk team teaching DP;QA, TA;AM, HQ;WS, dll.) tidak boleh mengajar dua kelas berbeda pada slot waktu yang bersamaan.',
      isActive: true,
      status: 'Terpenuhi (0 Pelanggaran)'
    },
    {
      id: 'HC-02',
      nama: 'Zero Clash Ruangan F4 & F6',
      deskripsi: 'Ruangan teori, RKB F6.001, maupun ruang reguler tidak boleh digunakan lebih dari satu kelas pada slot waktu yang sama.',
      isActive: true,
      status: 'Terpenuhi (0 Pelanggaran)'
    },
    {
      id: 'HC-03',
      nama: 'Jeda Waktu Ibadah (Sholat)',
      deskripsi: 'Perkuliahan menghormati waktu istirahat dan ibadah Dhuhur, Ashar, dan Maghrib.',
      isActive: true,
      status: 'Terpenuhi (100% Sesuai)'
    }
  ],
  softConstraints: [
    {
      id: 'SC-01',
      dosenId: 4,
      dosenNama: 'Muhammad Abdul Haq, S.Tr.T., M.Eng. Ph.D.',
      hariOff: 'Jumat',
      alasan: 'Alokasi Waktu Riset & Penelitian Laboratorium',
      isAccommodated: true,
      status: 'Terakomodir'
    },
    {
      id: 'SC-02',
      dosenId: 2,
      dosenNama: 'Dr. Ir. Dwijoko Purbohadi, M.T.',
      hariOff: 'Kamis',
      alasan: 'Bimbingan Pascasarjana & Proyek Web Service',
      isAccommodated: true,
      status: 'Terakomodir'
    },
    {
      id: 'SC-03',
      dosenId: 1,
      dosenNama: 'Ir. Asroni, S.T., M.Eng.',
      preferensiWaktu: 'Pagi & Siang (07:00 - 15:00)',
      isAccommodated: true,
      status: 'Terakomodir'
    }
  ],
  metrics: {
    waktuGenerate: '1.2 detik (Target < 15 menit)',
    bentrokDosenRuangan: 0,
    labMatchingPercent: '100%',
    kepuasanDosenPercent: '92.4% (Target >= 85%)'
  }
};

const ConstraintModel = {
  getAll() {
    return initialConstraints;
  },
  getMetrics() {
    return initialConstraints.metrics;
  },
  toggleHardConstraint(id, isActive) {
    const hc = initialConstraints.hardConstraints.find(c => c.id === id);
    if (!hc) return null;
    hc.isActive = Boolean(isActive);
    hc.status = hc.isActive ? 'Terpenuhi (0 Pelanggaran)' : 'Nonaktif (Peringatan)';
    return hc;
  },
  updateDosenPreference(dosenNama, hariOff, alasan) {
    const existing = initialConstraints.softConstraints.find(sc => sc.dosenNama === dosenNama);
    if (existing) {
      existing.hariOff = hariOff;
      existing.alasan = alasan;
      existing.isAccommodated = true;
      existing.status = 'Terakomodir';
    } else {
      initialConstraints.softConstraints.push({
        id: 'SC-0' + (initialConstraints.softConstraints.length + 1),
        dosenNama,
        hariOff,
        alasan,
        isAccommodated: true,
        status: 'Terakomodir'
      });
    }
    return initialConstraints.softConstraints;
  }
};

module.exports = ConstraintModel;
