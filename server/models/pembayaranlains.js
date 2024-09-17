"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pembayaranLains extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      pembayaranLains.belongsTo(models.itemRencanaPembayarans, {
        foreignKey: "itemRencanaPembayaranId",
        onDelete: "CASCADE",
      });
      pembayaranLains.hasMany(models.cicilanPemLains, {
        foreignKey: "pembayaranLainId",
        onDelete: "CASCADE",
      });
    }
  }
  pembayaranLains.init(
    {
      itemRencanaPembayaranId: DataTypes.INTEGER,
      tanggal: DataTypes.STRING,
      uraian: DataTypes.STRING,
      noInvoiceKwitansiJs: DataTypes.STRING,
      jumlahHarga: DataTypes.STRING,
      tanggalJatuhTempo: DataTypes.STRING,
      pembayaran: DataTypes.STRING,
      keterangan: DataTypes.STRING,
      noRekening: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "pembayaranLains",
    }
  );
  return pembayaranLains;
};
