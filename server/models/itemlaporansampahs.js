"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class itemLaporanSampahs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      itemLaporanSampahs.belongsTo(models.laporanSampahs, {
        foreignKey: "laporanSampahId",
        onDelete: "CASCADE",
      });
    }
  }
  itemLaporanSampahs.init(
    {
      laporanSampahId: DataTypes.INTEGER,
      noOrderProduksi: DataTypes.INTEGER,
      tahapProduksi: DataTypes.STRING,
      tanggal: DataTypes.STRING,
      pembeli: DataTypes.STRING,
      uraian: DataTypes.STRING,
      jumlah: DataTypes.STRING,
      hargaSatuan: DataTypes.STRING,
      pembayaran: DataTypes.STRING,
      keterangan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "itemLaporanSampahs",
    }
  );
  return itemLaporanSampahs;
};
