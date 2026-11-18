const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class MahasiswaPrakrs extends Model {}

  MahasiswaPrakrs.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mahasiswa_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      nim: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
      },
      kode_peminatan: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'SE',
      },
      pref_kelas: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 'B',
      },
      kelas_per_matkul: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      rekomendasi_sesi: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      total_sks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'MahasiswaPrakrs',
      tableName: 'mahasiswa_prakrs',
      underscored: true,
    }
  );

  return MahasiswaPrakrs;
};
