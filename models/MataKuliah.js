const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class MataKuliah extends Model {}

  MataKuliah.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          is: /^[A-Z0-9]{5,8}$/,
        },
      },
      nama: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          len: [3, 60],
        },
      },
      sks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 6,
        },
      },
      semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 8,
        },
      },
      kategori: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      jenis: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'Teori',
        validate: {
          isIn: [['Teori', 'Praktikum']],
        },
      },
      kode_peminatan: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      semester_penawaran: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'MataKuliah',
      tableName: 'mata_kuliahs',
      underscored: true,
    }
  );

  return MataKuliah;
};
