"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bahanLaporanProduksis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      bahanLaporanProduksis.belongsTo(models.laporanProduksis, {
        foreignKey: "laporanProduksiId",
        onDelete: "CASCADE",
      });
    }
  }
  bahanLaporanProduksis.init(
    {
      laporanProduksiId: DataTypes.INTEGER,
      tahapProduksi: DataTypes.STRING,
      jenis: DataTypes.STRING,
      kode: DataTypes.STRING,
      beratAwal: DataTypes.STRING,
      beratAkhir: DataTypes.STRING,
      keterangan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "bahanLaporanProduksis",
      tableName: "bahanLaporanProduksis"
    }
  );
  return bahanLaporanProduksis;
};
