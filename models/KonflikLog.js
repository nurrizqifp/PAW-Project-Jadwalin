const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class KonflikLog extends Model {}

  KonflikLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      periode_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tipe: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      kode_constraint: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      deskripsi: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      saran_perbaikan: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_resolved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'KonflikLog',
      tableName: 'konflik_logs',
      underscored: true,
    }
  );

  return KonflikLog;
};
