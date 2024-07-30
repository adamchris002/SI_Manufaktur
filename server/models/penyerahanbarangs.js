"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class penyerahanBarangs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      penyerahanBarangs.belongsToMany(models.users, {
        through: "UserPenyerahanBarangs",
      });
      penyerahanBarangs.hasMany(models.itemPenyerahanBarangs, {
        foreignKey: "penyerahanBarangId",
        onDelete: "CASCADE",
      });
    }
  }
  penyerahanBarangs.init(
    {
      orderId: DataTypes.INTEGER, 
      productionPlanningId: DataTypes.INTEGER,
      diambilOleh: DataTypes.STRING,
      tanggalPengambilan: DataTypes.STRING,
      tanggalPenyerahan: DataTypes.STRING,
      statusPenyerahan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "penyerahanBarangs",
    }
  );
  return penyerahanBarangs;
};
