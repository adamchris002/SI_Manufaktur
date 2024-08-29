"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bukuBanks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      bukuBanks.belongsToMany(models.users, {
        through: "UserBukuBanks",
        foreignKey: "bukuBankId",
        otherKey: "userId",
      });
      bukuBanks.hasMany(models.itemBukuBanks, {
        foreignKey: "bukuBankId",
        onDelete: "CASCADE",
      });
    }
  }
  bukuBanks.init(
    {
      namaBank: DataTypes.STRING,
      statusBukuBank: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "bukuBanks",
    }
  );
  return bukuBanks;
};
