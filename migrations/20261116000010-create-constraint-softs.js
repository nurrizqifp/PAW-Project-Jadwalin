'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('constraint_softs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dosen_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'dosens',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      hari_off: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      preferensi_waktu: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'Bebas',
      },
      alasan: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_accommodated: {
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
    await queryInterface.dropTable('constraint_softs');
  },
};
