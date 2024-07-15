"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class itemStokOpnams extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      itemStokOpnams.belongsTo(models.stokOpnams, {
        foreignKey: "stokOpnamId",
        onDelete: "CASCADE",
      });
    }
  }
  itemStokOpnams.init(
    {
      stokOpnamId: DataTypes.INTEGER,
      suratPesanan: DataTypes.STRING,
      tanggalMasuk: DataTypes.STRING,
      tanggalPengembalian: DataTypes.STRING,
      jenisBarang: DataTypes.STRING,
      kodeBarang: DataTypes.STRING,
      lokasiPenyimpanan: DataTypes.STRING,
      stokOpnamAwal: DataTypes.STRING,
      stokOpnamAkhir: DataTypes.STRING,
      stokFisik: DataTypes.STRING,
      stokSelisih: DataTypes.STRING,
      keterangan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "itemStokOpnams",
    }
  );
  return itemStokOpnams;
};
