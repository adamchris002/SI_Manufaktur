"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class estimasiJadwalProduksis extends Model {
    static associate(models) {
      estimasiJadwalProduksis.belongsTo(models.productionPlannings, {
        foreignKey: "productionPlanningId",
        onDelete: "CASCADE",
      });
      estimasiJadwalProduksis.hasMany(models.rencanaJadwalProduksis, {
        foreignKey: "estimasiJadwalProduksiId",
        onDelete: "CASCADE"
      });
    }
  }
  estimasiJadwalProduksis.init(
    {
      productionPlanningId: DataTypes.INTEGER,
      bagian: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "estimasiJadwalProduksis",
      tableName: "estimasiJadwalProduksis",  // Explicitly set the table name here
    }
  );
  return estimasiJadwalProduksis;
};
