const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Mahasiswa extends Model {}

  Mahasiswa.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nim: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          is: /^\d{11}$/,
        },
      },
      nama: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          len: [3, 60],
        },
      },
      angkatan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 2018,
          max: 2030,
        },
      },
      semester_aktif: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
          max: 8,
        },
      },
      kode_peminatan: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Mahasiswa',
      tableName: 'mahasiswas',
      underscored: true,
    }
  );

  return Mahasiswa;
};
