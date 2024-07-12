"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stokOpnams extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      stokOpnams.belongsToMany(models.users, { through: "UserStokOpnams" });
    }
  }
  stokOpnams.init(
    {
      suratPesanan: DataTypes.STRING,
      tanggalMasuk: DataTypes.STRING,
      tanggalPengembalian: DataTypes.STRING,
      jenisBarang: DataTypes.STRING,
      kodeBarang: DataTypes.STRING,
      lokasiPenyimpanan: DataTypes.STRING,
      stokOpnamAwal: DataTypes.STRING,
      stokOpnamAkhir: DataTypes.STRING,
      tanggalKeluar: DataTypes.STRING,
      jumlahPengambilan: DataTypes.STRING,
      diambilOleh: DataTypes.STRING,
      untukPekerjaan: DataTypes.STRING,
      stokFisik: DataTypes.STRING,
      stokSelisih: DataTypes.STRING,
      keterangan: DataTypes.STRING,
      uniqueId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "stokOpnams",
    }
  );
  return stokOpnams;
};
