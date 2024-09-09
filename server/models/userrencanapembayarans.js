"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRencanaPembayarans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserRencanaPembayarans.belongsTo(models.users, { foreignKey: "userId" });
      UserRencanaPembayarans.belongsTo(models.rencanaPembayarans, {
        foreignKey: "rencanaPembayaranId",
      });
    }
  }
  UserRencanaPembayarans.init(
    {
      userId: DataTypes.INTEGER,
      rencanaPembayaranId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserRencanaPembayarans",
    }
  );
  return UserRencanaPembayarans;
};
