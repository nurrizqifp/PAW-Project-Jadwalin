'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mata_kuliahs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      kode: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      nama: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      sks: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      semester: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      kategori: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      jenis: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'Teori',
      },
      kode_peminatan: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      semester_penawaran: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('mata_kuliahs');
  },
};
