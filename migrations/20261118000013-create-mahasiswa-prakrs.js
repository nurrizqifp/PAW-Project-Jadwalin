'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mahasiswa_prakrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      mahasiswa_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'mahasiswas',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      nim: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      semester: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5,
      },
      kode_peminatan: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'SE',
      },
      pref_kelas: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: 'B',
      },
      kelas_per_matkul: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      rekomendasi_sesi: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      total_sks: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.dropTable('mahasiswa_prakrs');
  },
};
