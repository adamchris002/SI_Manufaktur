"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserKasHarians extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserKasHarians.belongsTo(models.users, { foreignKey: "userId" });
      UserKasHarians.belongsTo(models.kasHarians, {
        foreignKey: "kasHarianId",
      });
    }
  }
  UserKasHarians.init(
    {
      userId: DataTypes.INTEGER,
      kasHarianId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserKasHarians",
    }
  );
  return UserKasHarians;
};
