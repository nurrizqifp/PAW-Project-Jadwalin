'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hardConstraints = [
      {
        id: 1,
        kode: 'HC-01',
        nama: 'Zero Clash Dosen & Team Teaching',
        deskripsi: 'Dosen (termasuk team teaching DP;QA, TA;AM, HQ;WS, dll.) tidak boleh mengajar dua kelas berbeda pada slot waktu yang bersamaan.',
        is_active: true,
      },
      {
        id: 2,
        kode: 'HC-02',
        nama: 'Zero Clash Ruangan F4 & F6',
        deskripsi: 'Ruangan teori, RKB F6.001, maupun ruang reguler tidak boleh digunakan lebih dari satu kelas pada slot waktu yang sama.',
        is_active: true,
      },
      {
        id: 3,
        kode: 'HC-03',
        nama: 'Jeda Waktu Ibadah (Sholat)',
        deskripsi: 'Perkuliahan menghormati waktu istirahat dan ibadah Dhuhur (11:30–12:10) dan Ashar (15:00–15:20).',
        is_active: true,
      },
      {
        id: 4,
        kode: 'LAB-MATCH',
        nama: 'Lab Matching Praktikum 100%',
        deskripsi: 'Mata kuliah bertipe Praktikum wajib ditempatkan pada ruangan bertipe Laboratorium.',
        is_active: true,
      },
    ].map(hc => ({
      ...hc,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    const softConstraints = [
      {
        id: 1,
        dosen_id: 4, // Muhammad Abdul Haq
        hari_off: 'Jumat',
        preferensi_waktu: 'Pagi',
        alasan: 'Alokasi Waktu Riset & Penelitian Laboratorium',
        is_accommodated: true,
      },
      {
        id: 2,
        dosen_id: 2, // Dr. Ir. Dwijoko Purbohadi
        hari_off: 'Kamis',
        preferensi_waktu: 'Siang',
        alasan: 'Bimbingan Pascasarjana & Proyek Web Service',
        is_accommodated: true,
      },
      {
        id: 3,
        dosen_id: 1, // Ir. Asroni
        hari_off: null,
        preferensi_waktu: 'Pagi',
        alasan: 'Preferensi Mengajar Pagi & Siang (07:00 - 15:00)',
        is_accommodated: true,
      },
    ].map(sc => ({
      ...sc,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('constraint_hards', hardConstraints, {});
    await queryInterface.bulkInsert('constraint_softs', softConstraints, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('constraint_softs', null, {});
    await queryInterface.bulkDelete('constraint_hards', null, {});
  },
};
