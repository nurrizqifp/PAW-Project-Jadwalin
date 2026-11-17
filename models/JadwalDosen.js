const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class JadwalDosen extends Model {}

  JadwalDosen.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      jadwal_sesi_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dosen_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_team_teaching: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'JadwalDosen',
      tableName: 'jadwal_dosens',
      underscored: true,
    }
  );

  return JadwalDosen;
};
