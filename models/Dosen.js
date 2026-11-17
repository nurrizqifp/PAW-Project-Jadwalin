const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Dosen extends Model {}

  Dosen.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      inisial: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
      },
      nidn: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      nama: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      keahlian: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      beban_sks_max: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 12,
      },
    },
    {
      sequelize,
      modelName: 'Dosen',
      tableName: 'dosens',
      underscored: true,
    }
  );

  return Dosen;
};
