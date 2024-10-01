"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pembelianBahanBakus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      pembelianBahanBakus.belongsTo(models.permohonanPembelians, {
        foreignKey: "permohonanPembelianId",
        onDelete: "CASCADE",
      });
      pembelianBahanBakus.hasMany(models.itemPembelianBahanBakus, {
        foreignKey: "pembelianBahanBakuId",
        onDelete: "CASCADE",
      });
    }
  }
  pembelianBahanBakus.init(
    {
      permohonanPembelianId: DataTypes.INTEGER,
      leveransir: DataTypes.STRING,
      alamat: DataTypes.STRING,
      statusPajakMasukan: DataTypes.STRING,
      statusHutang: DataTypes.STRING,
      lokasi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "pembelianBahanBakus",
    }
  );
  return pembelianBahanBakus;
};
