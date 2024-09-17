"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class hutangs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      hutangs.belongsTo(models.itemRencanaPembayarans, {
        foreignKey: "itemRencanaPembayaranId",
        onDelete: "CASCADE",
      });
      hutangs.hasMany(models.cicilans, {
        foreignKey: "hutangId",
        onDelete: "CASCADE",
      });
    }
  }
  hutangs.init(
    {
      itemRencanaPembayaranId: DataTypes.INTEGER,
      tanggal: DataTypes.STRING,
      jenisBarang: DataTypes.STRING,
      noInvoiceKwitansiJs: DataTypes.STRING,
      tanggalJatuhTempo: DataTypes.STRING,
      pembayaran: DataTypes.STRING,
      keterangan: DataTypes.STRING,
      noRekening: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "hutangs",
    }
  );
  return hutangs;
};
