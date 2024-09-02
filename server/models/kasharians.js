"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class kasHarians extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      kasHarians.belongsToMany(models.users, {
        through: "UserKasHarians",
        foreignKey: "kasHarianId",
        otherKey: "userId",
      });
      kasHarians.hasMany(models.itemKasHarians, {
        foreignKey: "kasHarianId",
        onDelete: "CASCADE",
      });
    }
  }
  kasHarians.init(
    {
      judulKasHarian: DataTypes.STRING,
      statusKasHarian: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "kasHarians",
    }
  );
  return kasHarians;
};
