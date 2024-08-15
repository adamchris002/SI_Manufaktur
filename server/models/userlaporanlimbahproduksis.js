"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserLaporanLimbahProduksis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserLaporanLimbahProduksis.belongsTo(models.users, {
        foreignKey: "userId",
      });
      UserLaporanLimbahProduksis.belongsTo(models.laporanLimbahProduksis, {
        foreignKey: "laporanLimbahProduksiId",
      });
    }
  }
  UserLaporanLimbahProduksis.init(
    {
      userId: DataTypes.INTEGER,
      laporanLimbahProduksiId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserLaporanLimbahProduksis",
      tableName: "UserLaporanLimbahProduksis",
    }
  );
  return UserLaporanLimbahProduksis;
};
