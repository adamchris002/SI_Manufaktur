"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class jangkaWaktuProduksis extends Model {
    static associate(models) {
      jangkaWaktuProduksis.belongsTo(models.productionPlannings, {
        foreignKey: "productionPlanningId",
      });
    }
  }
  jangkaWaktuProduksis.init(
    {
      productionPlanningId: DataTypes.INTEGER,
      bagian: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "jangkaWaktuProduksis",
    }
  );
  return jangkaWaktuProduksis;
};
