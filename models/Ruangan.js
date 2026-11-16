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
      },
      nama: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      gedung: {
        type: DataTypes.STRING(20),
        allowNull: false,
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
