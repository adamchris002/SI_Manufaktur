"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pajakKeluarans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      pajakKeluarans.belongsTo(models.bukuBanks, {
        foreignKey: "bukuBankId",
        onDelete: "CASCADE",
      });
    }
  }
  pajakKeluarans.init(
    {
      bukuBankId: DataTypes.INTEGER,
      tanggal: DataTypes.STRING,
      pemberiPekerjaan: DataTypes.STRING,
      jenisBarang: DataTypes.STRING,
      kuantitas: DataTypes.STRING,
      hargaSatuan: DataTypes.STRING,
      jumlahHarga: DataTypes.STRING,
      noTglSpk: DataTypes.STRING,
      noSeriTglFakturPajak: DataTypes.STRING,
      dpp: DataTypes.STRING,
      ppn: DataTypes.STRING,
      pph: DataTypes.STRING,
      keterangan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "pajakKeluarans",
    }
  );
  return pajakKeluarans;
};
