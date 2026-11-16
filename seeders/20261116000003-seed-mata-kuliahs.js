'use strict';

const masterModel = require('../models/masterModel');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const kur = masterModel.getKurikulum();
    const pem = masterModel.getPeminatan();

    let id = 1;
    const allMk = [];

    // 57 Mata Kuliah Kurikulum
    for (const k of kur) {
      const isPraktikum = ['TI203', 'TI205', 'TI303', 'TI304', 'TI403'].includes(k.kode) || k.nama.toLowerCase().includes('praktikum');
      allMk.push({
        id: id++,
        kode: k.kode,
        nama: k.nama,
        sks: k.sks,
        semester: k.semester,
        kategori: k.kategori || 'Wajib',
        jenis: isPraktikum ? 'Praktikum' : 'Teori',
        kode_peminatan: null,
        semester_penawaran: k.semester % 2 === 1 ? 'Ganjil' : 'Genap',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // 20 Mata Kuliah Pilihan Peminatan (PR, DA, NE, UX)
    for (const p of pem) {
      allMk.push({
        id: id++,
        kode: p.kode,
        nama: p.nama,
        sks: p.sks,
        semester: p.semesterPenawaran === 'Ganjil' ? 7 : 6,
        kategori: 'Pilihan Peminatan',
        jenis: p.jenis || 'Teori',
        kode_peminatan: p.kodePeminatan,
        semester_penawaran: p.semesterPenawaran,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('mata_kuliahs', allMk, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('mata_kuliahs', null, {});
  },
};
