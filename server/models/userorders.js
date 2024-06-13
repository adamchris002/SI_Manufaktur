"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserOrders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserOrders.belongsTo(models.users, { foreignKey: "userId" });
      UserOrders.belongsTo(models.orders, { foreignKey: "orderId" });
    }
  }
  UserOrders.init(
    {
      userId: DataTypes.INTEGER,
      orderId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserOrders",
    }
  );
  return UserOrders;
};
