"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class laporanLimbahProduksis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      laporanLimbahProduksis.belongsToMany(models.users, {
        through: "UserLaporanLimbahProduksis",
        foreignKey: "laporanLimbahProduksiId",
        otherKey: "userId",
      });
      laporanLimbahProduksis.hasMany(models.itemLaporanLimbahProduksis, {
        foreignKey: "laporanLimbahProduksiId",
        onDelete: "CASCADE",
      });
      laporanLimbahProduksis.hasOne(models.laporanSampahs, {
        foreignKey: "laporanLimbahProduksiId",
        onDelete: "CASCADE",
      });
    }
  }
  laporanLimbahProduksis.init(
    {
      noOrderProduksi: DataTypes.INTEGER,
      dibuatOleh: DataTypes.STRING,
      tanggalPembuatan: DataTypes.STRING,
      tahapProduksi: DataTypes.STRING,
      lokasi: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "laporanLimbahProduksis",
      tableName: "laporanLimbahProduksis",
    }
  );
  return laporanLimbahProduksis;
};
