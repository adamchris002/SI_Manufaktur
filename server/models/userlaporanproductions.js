"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserLaporanProductions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserLaporanProductions.belongsTo(models.users, { foreignKey: "userId" });
      UserLaporanProductions.belongsTo(models.laporanProduksis, {
        foreignKey: "laporanProduksiId",
      });
    }
  }
  UserLaporanProductions.init(
    {
      userId: DataTypes.INTEGER,
      laporanProductionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserLaporanProductions",
    }
  );
  return UserLaporanProductions;
};
