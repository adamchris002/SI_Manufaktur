"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class laporanSampahs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      laporanSampahs.belongsTo(models.laporanLimbahProduksis, {
        foreignKey: "laporanLimbahProduksiId",
        onDelete: "CASCADE",
      });
      laporanSampahs.hasMany(models.itemLaporanSampahs, {
        foreignKey: "laporanSampahId",
        onDelete: "CASCADE",
      });
    }
  }
  laporanSampahs.init(
    {
      laporanLimbahProduksiId: DataTypes.INTEGER,
      noOrderProduksi: DataTypes.INTEGER,
      tahapProduksi: DataTypes.STRING,
      lokasi: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "laporanSampahs",
    }
  );
  return laporanSampahs;
};
