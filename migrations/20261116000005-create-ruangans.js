'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ruangans', {
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
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      gedung: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      tipe: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'Ruang Kuliah',
      },
      kapasitas: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 40,
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
    await queryInterface.dropTable('ruangans');
  },
};
