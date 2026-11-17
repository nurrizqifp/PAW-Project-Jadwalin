const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class ConstraintSoft extends Model {}

  ConstraintSoft.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dosen_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hari_off: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          isIn: [['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']],
        },
      },
      preferensi_waktu: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'Bebas',
      },
      alasan: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [3, 80],
        },
      },
      is_accommodated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'ConstraintSoft',
      tableName: 'constraint_softs',
      underscored: true,
    }
  );

  return ConstraintSoft;
};
