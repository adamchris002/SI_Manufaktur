"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class jadwalProduksis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      jadwalProduksis.belongsTo(models.laporanProduksis, {
        foreignKey: "laporanProduksiId",
        onDelete: "CASCADE",
      });
    }
  }
  jadwalProduksis.init(
    {
      laporanProduksiId: DataTypes.INTEGER,
      tahapProduksi: DataTypes.STRING,
      jamAwalProduksi: DataTypes.STRING,
      jamAkhirProduksi: DataTypes.STRING,
      noOrderProduksi: DataTypes.STRING,
      jenisCetakan: DataTypes.STRING,
      perolehanCetak: DataTypes.STRING,
      waste: DataTypes.STRING,
      keterangan: DataTypes.STRING,
      jenisBahanKertas: DataTypes.STRING,
      kodeRoll: DataTypes.STRING,
      beratBahanKertas: DataTypes.STRING,
      sobek: DataTypes.STRING,
      kulit: DataTypes.STRING,
      gelondong: DataTypes.STRING,
      sampah: DataTypes.STRING,
      rollHabis: DataTypes.BOOLEAN,
      rollSisa: DataTypes.BOOLEAN,
      nomoratorAwal: DataTypes.STRING,
      nomoratorAkhir: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "jadwalProduksis",
      tableName: "jadwalProduksis"
    }
  );
  return jadwalProduksis;
};
