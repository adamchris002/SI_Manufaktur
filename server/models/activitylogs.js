"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class activitylogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      activitylogs.belongsToMany(models.users, {
        through: "UserActivityLogs",
        foreignKey: "activityLogsId",
      });
    }
  }
  activitylogs.init(
    {
      user: DataTypes.STRING,
      activity: DataTypes.STRING,
      name: DataTypes.STRING,
      division: DataTypes.STRING,
      lokasi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "activitylogs",
    }
  );
  return activitylogs;
};
