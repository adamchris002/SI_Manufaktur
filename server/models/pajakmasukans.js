"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pajakMasukans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      pajakMasukans.belongsTo(models.bukuBanks, {
        foreignKey: "bukuBankId",
        onDelete: "CASCADE",
      });
    }
  }
  pajakMasukans.init(
    {
      bukuBankId: DataTypes.INTEGER,
      tanggal: DataTypes.STRING,
      leveransir: DataTypes.STRING,
      noTglOrder: DataTypes.STRING,
      jenisBarang: DataTypes.STRING,
      kuantitas: DataTypes.STRING,
      hargaSatuan: DataTypes.STRING,
      jumlahHarga: DataTypes.STRING,
      noInvoiceKwitansiSj: DataTypes.STRING,
      noSeriFakturPajak: DataTypes.STRING,
      dpp: DataTypes.STRING,
      ppn: DataTypes.STRING,
      keterangan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "pajakMasukans",
    }
  );
  return pajakMasukans;
};
