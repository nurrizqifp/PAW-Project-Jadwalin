'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jadwal_sesis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      periode_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'periode_jadwals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      mata_kuliah_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'mata_kuliahs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ruangan_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ruangans',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      hari: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      jam_mulai: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      jam_selesai: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      kelas: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      is_pilihan: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_lab_valid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      melewati_istirahat: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable('jadwal_sesis');
  },
};
