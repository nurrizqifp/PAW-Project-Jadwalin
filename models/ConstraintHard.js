const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class ConstraintHard extends Model {}

  ConstraintHard.init(
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
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'ConstraintHard',
      tableName: 'constraint_hards',
      underscored: true,
    }
  );

  return ConstraintHard;
};
