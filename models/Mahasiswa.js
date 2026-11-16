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
      },
      nama: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      angkatan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      semester_aktif: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
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
