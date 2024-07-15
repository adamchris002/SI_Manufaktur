"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserStokOpnams extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserStokOpnams.belongsTo(models.users, { foreignKey: "userId" });
      UserStokOpnams.belongsTo(models.stokOpnams, {
        foreignKey: "stokOpnamId",
      });
    }
  }
  UserStokOpnams.init(
    {
      userId: DataTypes.INTEGER,
      stokOpnamId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserStokOpnams",
    }
  );
  return UserStokOpnams;
};
