"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class itemPembelianBahanBakus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      itemPembelianBahanBakus.belongsTo(models.pembelianBahanBakus, {
        foreignKey: "pembelianBahanBakuId",
        onDelete: "CASCADE",
      });
    }
  }
  itemPembelianBahanBakus.init(
    {
      pembelianBahanBakuId: DataTypes.INTEGER,
      tanggal: DataTypes.STRING,
      noOrder: DataTypes.STRING,
      jenisBarang: DataTypes.STRING,
      rincianBarang: DataTypes.STRING,
      jumlahOrder: DataTypes.STRING,
      hargaSatuan: DataTypes.STRING,
      jumlahHarga: DataTypes.STRING,
      tanggalSuratJalan: DataTypes.STRING,
      noSuratJalan: DataTypes.STRING,
      tanggalTerimaBarang: DataTypes.STRING,
      diterimaOleh: DataTypes.STRING,
      fakturPajak: DataTypes.STRING,
      tanggalJatuhTempo: DataTypes.STRING,
      tanggalPengiriman: DataTypes.STRING,
      jumlahTerimaPengiriman: DataTypes.STRING,
      sisaPengiriman: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "itemPembelianBahanBakus",
    }
  );
  return itemPembelianBahanBakus;
};
