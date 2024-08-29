"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserBukuBanks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserBukuBanks.belongsTo(models.users, { foreignKey: "userId" });
      UserBukuBanks.belongsTo(models.bukuBanks, { foreignKey: "bukuBankId" });
    }
  }
  UserBukuBanks.init(
    {
      userId: DataTypes.INTEGER,
      bukuBankId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserBukuBanks",
    }
  );
  return UserBukuBanks;
};
