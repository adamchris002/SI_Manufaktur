"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class itemLaporanLimbahProduksis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      itemLaporanLimbahProduksis.belongsTo(models.laporanLimbahProduksis, {
        foreignKey: "laporanLimbahProduksiId",
        onDelete: "CASCADE",
      });
    }
  }
  itemLaporanLimbahProduksis.init(
    {
      laporanLimbahProduksiId: DataTypes.INTEGER,
      noOrderProduksiId: DataTypes.INTEGER,
      namaBarang: DataTypes.STRING,
      jumlahBarang: DataTypes.STRING,
      keterangan: DataTypes.STRING,
      tahapProduksi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "itemLaporanLimbahProduksis",
      tableName: "itemLaporanLimbahProduksis",
    }
  );
  return itemLaporanLimbahProduksis;
};
