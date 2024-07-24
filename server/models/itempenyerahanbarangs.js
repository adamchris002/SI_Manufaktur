"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class itemPenyerahanBarangs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      itemPenyerahanBarangs.belongsTo(models.penyerahanBarangs, {
        foreignKey: "penyerahanBarangId",
        onDelete: "CASCADE",
      });
    }
  }
  itemPenyerahanBarangs.init(
    {
      penyerahanBarangId: DataTypes.INTEGER,
      namaBarang: DataTypes.STRING,
      kodeBarang: DataTypes.STRING,
      rincianItem: DataTypes.STRING,
      jumlahYangDiambil: DataTypes.STRING,
      selisihBarang: DataTypes.STRING,
      lokasiPenyimpanan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "itemPenyerahanBarangs",
    }
  );
  return itemPenyerahanBarangs;
};
