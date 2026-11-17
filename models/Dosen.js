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
        validate: {
          len: [2, 3],
          is: /^[A-Z]{2,3}$/,
        },
      },
      nidn: {
        type: DataTypes.STRING(30),
        allowNull: true,
        validate: {
          is: /^\d{10}$/,
        },
      },
      nama: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          len: [3, 60],
        },
      },
      keahlian: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          len: [3, 80],
        },
      },
      beban_sks_max: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 12,
        validate: {
          min: 2,
          max: 48,
        },
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
