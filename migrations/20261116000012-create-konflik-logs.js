'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('konflik_logs', {
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
      tipe: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      kode_constraint: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      saran_perbaikan: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_resolved: {
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
    await queryInterface.dropTable('konflik_logs');
  },
};
