"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserLaporanProduksis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserLaporanProduksis.belongsTo(models.users, {
        foreignKey: "userId",
      });
      UserLaporanProduksis.belongsTo(models.laporanProduksis, {
        foreignKey: "laporanProduksiId",
      });
    }
  }
  UserLaporanProduksis.init(
    {
      userId: DataTypes.INTEGER,
      laporanProduksiId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserLaporanProduksis",
      tableName: "UserLaporanProduksis",
    }
  );
  return UserLaporanProduksis;
};
