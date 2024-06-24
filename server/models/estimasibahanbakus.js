"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class estimasiBahanBakus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      estimasiBahanBakus.belongsTo(models.productionPlannings, {
        foreignKey: "productionPlanningId",
        onDelete: "CASCADE"
      });
      estimasiBahanBakus.hasMany(models.bahanBakuAkanDigunakans, {
        foreignKey: "estimasiBahanBakuId",
        onDelete: "CASCADE"
      })
    }
  }
  estimasiBahanBakus.init(
    {
      productionPlanningId: DataTypes.INTEGER,
      jenis: DataTypes.STRING,
      informasi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "estimasiBahanBakus",
    }
  );
  return estimasiBahanBakus;
};
