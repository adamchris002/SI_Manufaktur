"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserProductionPlannings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserProductionPlannings.belongsTo(models.users, { foreignKey: "userId" });
      UserProductionPlannings.belongsTo(models.productionPlannings, {
        foreignKey: "productionPlanningId",
      });
    }
  }
  UserProductionPlannings.init(
    {
      userId: DataTypes.INTEGER,
      productionPlanningId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserProductionPlannings",
    }
  );
  return UserProductionPlannings;
};
