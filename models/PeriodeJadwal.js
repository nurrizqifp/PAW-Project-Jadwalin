const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class PeriodeJadwal extends Model {}

  PeriodeJadwal.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      tahun_akademik: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      semester_tipe: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          isIn: [['Ganjil', 'Genap']],
        },
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'Draft',
        validate: {
          isIn: [['Draft', 'Terpublikasi', 'Arsip']],
        },
      },
      generated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      published_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      generated_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'PeriodeJadwal',
      tableName: 'periode_jadwals',
      underscored: true,
    }
  );

  return PeriodeJadwal;
};
