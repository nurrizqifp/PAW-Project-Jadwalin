const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Notifikasi extends Model {}

  Notifikasi.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      periode_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      target_role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'all',
        validate: {
          isIn: [['all', 'admin', 'dosen', 'mahasiswa']],
        },
      },
      target_ref_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      judul: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      isi: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Notifikasi',
      tableName: 'notifikasis',
      underscored: true,
    }
  );

  return Notifikasi;
};
