"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserPenyerahanBarangs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserPenyerahanBarangs.belongsTo(models.users, { foreignKey: "userId" });
      UserPenyerahanBarangs.belongsTo(models.penyerahanBarangs, {
        foreignKey: "penyerahanBarangId",
      });
    }
  }
  UserPenyerahanBarangs.init(
    {
      userId: DataTypes.INTEGER,
      penyerahanBarangId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserPenyerahanBarangs",
    }
  );
  return UserPenyerahanBarangs;
};
