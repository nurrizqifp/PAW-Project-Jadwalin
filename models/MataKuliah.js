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
      },
      nama: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      sks: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      kategori: {
        type: Sequelize => DataTypes.STRING(50),
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
