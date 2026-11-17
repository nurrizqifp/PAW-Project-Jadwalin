'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const ruangans = [
      { id: 1, kode: 'F6.001', nama: 'Ruang Kuliah Besar F6.001', gedung: 'Gedung F6', tipe: 'Ruang Kuliah Besar', kapasitas: 80 },
      { id: 2, kode: 'F6.002', nama: 'Ruang Teori F6.002', gedung: 'Gedung F6', tipe: 'Ruang Kuliah', kapasitas: 45 },
      { id: 3, kode: 'F6.003', nama: 'Ruang Teori F6.003', gedung: 'Gedung F6', tipe: 'Ruang Kuliah', kapasitas: 45 },
      { id: 4, kode: 'F6.004', nama: 'Ruang Teori F6.004', gedung: 'Gedung F6', tipe: 'Ruang Kuliah', kapasitas: 40 },
      { id: 5, kode: 'F6.101', nama: 'Ruang Kuliah F6.101', gedung: 'Gedung F6', tipe: 'Ruang Kuliah', kapasitas: 40 },
      { id: 6, kode: 'F6.102', nama: 'Ruang Kuliah F6.102', gedung: 'Gedung F6', tipe: 'Ruang Kuliah', kapasitas: 40 },
      { id: 7, kode: 'F6.103', nama: 'Ruang Kuliah F6.103', gedung: 'Gedung F6', tipe: 'Ruang Kuliah', kapasitas: 40 },
      { id: 8, kode: 'F6.202', nama: 'Ruang Kuliah F6.202', gedung: 'Gedung F6', tipe: 'Ruang Kuliah', kapasitas: 35 },
      { id: 9, kode: 'F6.203', nama: 'Ruang Kuliah F6.203', gedung: 'Gedung F6', tipe: 'Ruang Kuliah', kapasitas: 35 },
      { id: 10, kode: 'F4.001', nama: 'Laboratorium Komputer F4.001', gedung: 'Gedung F4', tipe: 'Laboratorium', kapasitas: 40 },
      { id: 11, kode: 'F4.002', nama: 'Laboratorium Jaringan & Multimedia F4.002', gedung: 'Gedung F4', tipe: 'Laboratorium', kapasitas: 40 },
      { id: 12, kode: 'F4.003', nama: 'Ruang Kuliah F4.003', gedung: 'Gedung F4', tipe: 'Ruang Kuliah', kapasitas: 40 },
    ].map(r => ({
      ...r,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('ruangans', ruangans, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ruangans', null, {});
  },
};
