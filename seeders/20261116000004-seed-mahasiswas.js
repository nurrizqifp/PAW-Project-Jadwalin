'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const mahasiswas = [
      { id: 1, nim: '20240140001', nama: 'Andi Pratama', angkatan: 2024, semester_aktif: 4, kode_peminatan: 'PR' },
      { id: 2, nim: '20240140089', nama: 'Bima Eka Setiawan', angkatan: 2024, semester_aktif: 4, kode_peminatan: 'DA' },
      { id: 3, nim: '20240140056', nama: 'Nur Rizqi Febriansyah Putra', angkatan: 2024, semester_aktif: 4, kode_peminatan: 'NE' },
      { id: 4, nim: '20240140091', nama: 'Resya Glamoda Suhendri', angkatan: 2024, semester_aktif: 4, kode_peminatan: 'UX' },
      { id: 5, nim: '20240140075', nama: 'Nisrina Hanifah Ramadhani', angkatan: 2024, semester_aktif: 4, kode_peminatan: 'PR' },
      { id: 6, nim: '20240140093', nama: 'Haidar Yahya Mudhofar', angkatan: 2024, semester_aktif: 4, kode_peminatan: 'UX' },
      { id: 7, nim: '20240140133', nama: 'A. Muh. Fadil Asytar', angkatan: 2024, semester_aktif: 4, kode_peminatan: 'DA' },
    ].map(m => ({
      ...m,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('mahasiswas', mahasiswas, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('mahasiswas', null, {});
  },
};
