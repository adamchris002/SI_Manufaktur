'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class rencanaJadwalProduksis extends Model {
    static associate(models) {
      rencanaJadwalProduksis.belongsTo(models.estimasiJadwalProduksis, {
        foreignKey: "estimasiJadwalProduksiId",
        onDelete: "CASCADE"
      });
    }
  }

  rencanaJadwalProduksis.init({
    estimasiJadwalProduksiId: DataTypes.INTEGER,
    jenisPekerjaan: DataTypes.STRING,
    tanggalMulai: DataTypes.STRING,
    tanggalSelesai: DataTypes.STRING,
    jumlahHari: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'rencanaJadwalProduksis',
    tableName: 'rencanaJadwalProduksis' 
  });

  return rencanaJadwalProduksis;
};
