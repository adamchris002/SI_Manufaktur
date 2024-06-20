"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      orders.belongsToMany(models.users, { through: "UserOrders" });
      orders.hasMany(models.documents, {
        foreignKey: "orderId",
        onDelete: "CASCADE",
      });
    }
  }
  orders.init(
    {
      orderTitle: DataTypes.STRING,
      orderQuantity: DataTypes.STRING,
      orderDetails: DataTypes.STRING,
      orderStatus: DataTypes.STRING,
      customerChannel: DataTypes.STRING,
      customerDetail: DataTypes.STRING,
      orderTotalPrice: DataTypes.STRING,
      orderType: DataTypes.STRING,
      orderNoSeries: DataTypes.STRING,
      orderDueDate: DataTypes.STRING,
      alamatPengiriman: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "orders",
    }
  );
  return orders;
};
