"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserActivityLogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserActivityLogs.belongsTo(models.users, { foreignKey: "userId" });
      UserActivityLogs.belongsTo(models.activitylogs, {
        foreignKey: "activityLogsId",
      });
    }
  }
  UserActivityLogs.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      activityLogsId: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("NOW()"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("NOW()"),
      },
    },
    {
      sequelize,
      modelName: "UserActivityLogs",
    }
  );
  return UserActivityLogs;
};
