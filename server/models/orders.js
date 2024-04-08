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
      orders.hasMany(models.images);
    }
  }
  orders.init(
    {
      orderTitle: DataTypes.STRING,
      orderQuantity: DataTypes.STRING,
      orderDetails: DataTypes.STRING,
      customerChannel: DataTypes.STRING,
      customerDetail: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "orders",
    }
  );
  return orders;
};
