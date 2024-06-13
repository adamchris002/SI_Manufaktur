"use strict";
const { Model } = require("sequelize");
const activitylogs = require("./activitylogs");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      users.belongsToMany(models.orders, { through: "UserOrders" });
      users.hasMany(models.orders, { foreignKey: "id" });
      // users.hasMany(models.activityLogs, { foreignKey: "userId" });
      users.belongsToMany(models.activitylogs, { through: "UserActivityLogs" });
    }
  }
  users.init(
    {
      userid: DataTypes.INTEGER,
      name: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      department: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
