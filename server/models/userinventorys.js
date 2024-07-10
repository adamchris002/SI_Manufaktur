"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserInventorys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserInventorys.belongsTo(models.users, { foreignKey: "userId" });
      UserInventorys.belongsTo(models.inventorys, {
        foreignKey: "inventoryId",
      });
    }
  }
  UserInventorys.init(
    {
      userId: DataTypes.INTEGER,
      inventoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserInventorys",
    }
  );
  return UserInventorys;
};
