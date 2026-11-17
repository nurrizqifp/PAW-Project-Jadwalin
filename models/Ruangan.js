const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Ruangan extends Model {}

  Ruangan.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 10],
          is: /^F[46]\.[A-Z0-9]{2,6}$/,
        },
      },
      nama: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [3, 50],
        },
      },
      gedung: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          isIn: [['F4', 'F6']],
        },
      },
      tipe: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Ruang Kuliah',
        validate: {
          isIn: [['Laboratorium', 'Ruang Kuliah Besar', 'Ruang Kuliah']],
        },
      },
      kapasitas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 40,
        validate: {
          min: 10,
          max: 120,
        },
      },
    },
    {
      sequelize,
      modelName: 'Ruangan',
      tableName: 'ruangans',
      underscored: true,
    }
  );

  return Ruangan;
};
