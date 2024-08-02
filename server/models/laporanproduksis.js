"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class laporanProduksis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      laporanProduksis.belongsToMany(models.users, {
        through: "UserLaporanProduksis",
      });
      laporanProduksis.hasMany(models.bahanLaporanProduksis, {
        foreignKey: "laporanProduksiId",
        onDelete: "CASCADE",
      });
      laporanProduksis.hasMany(models.personils, {
        foreignKey: "laporanProduksiId",
        onDelete: "CASCADE",
      });
      laporanProduksis.hasMany(models.jadwalProduksis, {
        foreignKey: "laporanProduksiId",
        onDelete: "CASCADE",
      });
    }
  }
  laporanProduksis.init(
    {
      tanggalProduksi: DataTypes.STRING,
      noOrderProduksi: DataTypes.STRING,
      jenisCetakan: DataTypes.STRING,
      mesin: DataTypes.STRING,
      dibuatOleh: DataTypes.STRING,
      tahapProduksi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "laporanProduksis",
    }
  );
  return laporanProduksis;
};
