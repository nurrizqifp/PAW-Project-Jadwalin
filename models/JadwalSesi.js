const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class JadwalSesi extends Model {}

  JadwalSesi.init(
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
      mata_kuliah_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ruangan_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      hari: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          isIn: [['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']],
        },
      },
      jam_mulai: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      jam_selesai: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      kelas: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      is_pilihan: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_lab_valid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      melewati_istirahat: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'JadwalSesi',
      tableName: 'jadwal_sesis',
      underscored: true,
    }
  );

  return JadwalSesi;
};
