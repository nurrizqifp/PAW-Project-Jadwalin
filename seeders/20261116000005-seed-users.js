'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const adminPass = await bcrypt.hash('admin123', 10);
    const dosenPass = await bcrypt.hash('dosen123', 10);
    const mhsPass = await bcrypt.hash('mhs123', 10);

    const users = [
      // 1. Admin Akademik (Persona Rina Wulandari)
      { id: 1, username: 'admin', password_hash: adminPass, role: 'admin', ref_id: null },
      { id: 2, username: 'rina', password_hash: adminPass, role: 'admin', ref_id: null },

      // 2. Dosen (Persona Budi Santoso / Ir. Asroni / Dr. Dwijoko / Dr. Haq)
      { id: 3, username: 'dosen_budi', password_hash: dosenPass, role: 'dosen', ref_id: 1 },
      { id: 4, username: 'asroni', password_hash: dosenPass, role: 'dosen', ref_id: 1 },
      { id: 5, username: 'dwijoko', password_hash: dosenPass, role: 'dosen', ref_id: 2 },
      { id: 6, username: 'abdulhaq', password_hash: dosenPass, role: 'dosen', ref_id: 4 },

      // 3. Mahasiswa (Persona Andi Pratama & Tim)
      { id: 7, username: '20240140001', password_hash: mhsPass, role: 'mahasiswa', ref_id: 1 },
      { id: 8, username: '20240140089', password_hash: mhsPass, role: 'mahasiswa', ref_id: 2 },
      { id: 9, username: '20240140056', password_hash: mhsPass, role: 'mahasiswa', ref_id: 3 },
      { id: 10, username: '20240140091', password_hash: mhsPass, role: 'mahasiswa', ref_id: 4 },
      { id: 11, username: '20240140075', password_hash: mhsPass, role: 'mahasiswa', ref_id: 5 },
      { id: 12, username: '20240140093', password_hash: mhsPass, role: 'mahasiswa', ref_id: 6 },
      { id: 13, username: '20240140133', password_hash: mhsPass, role: 'mahasiswa', ref_id: 7 },
    ].map(u => ({
      ...u,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
