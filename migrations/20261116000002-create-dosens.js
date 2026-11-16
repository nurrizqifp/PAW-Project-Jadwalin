'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dosens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      inisial: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
      },
      nidn: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      nama: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      keahlian: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      beban_sks_max: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 12,
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
    await queryInterface.dropTable('dosens');
  },
};
