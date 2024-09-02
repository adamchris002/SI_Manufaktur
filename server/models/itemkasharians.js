"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class itemKasHarians extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      itemKasHarians.belongsTo(models.kasHarians, {
        foreignKey: "kasHarianId",
        onDelete: "CASCADE",
      });
    }
  }
  itemKasHarians.init(
    {
      kasHarianId: DataTypes.INTEGER,
      tanggal: DataTypes.STRING,
      uraian: DataTypes.STRING,
      nomorBp: DataTypes.STRING,
      pos: DataTypes.STRING,
      debet: DataTypes.STRING,
      kredit: DataTypes.STRING,
      sisa: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "itemKasHarians",
    }
  );
  return itemKasHarians;
};
