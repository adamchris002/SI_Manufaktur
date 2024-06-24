"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class estimasiJangkaProduksis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      estimasiJangkaProduksis.belongsTo(models.jangkaWaktuProduksis, {
        foreignKey: "jangkaWaktuProduksiId",
        onDelete: "CASCADE",
      });
    }
  }
  estimasiJangkaProduksis.init(
    {
      jangkaWaktuProduksiId: DataTypes.INTEGER,
      jenisPekerjaan: DataTypes.STRING,
      tanggalMulai: DataTypes.DATE,
      tanggalSelesai: DataTypes.DATE,
      jumlahHari: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "estimasiJangkaProduksis",
    }
  );
  return estimasiJangkaProduksis;
};
