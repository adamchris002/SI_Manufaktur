"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class productionPlannings extends Model {
    static associate(models) {
      productionPlannings.belongsToMany(models.users, {
        through: "UserProductionPlannings",
      });
      productionPlannings.hasMany(models.estimasiJadwalProduksis, {
        foreignKey: "productionPlanningId",
        onDelete: "CASCADE",
      });
      productionPlannings.hasMany(models.estimasiBahanBakus, {
        foreignKey: "productionPlanningId",
        onDelete: "CASCADE",
      });
      productionPlannings.hasMany(models.rincianCetakans, {
        foreignKey: "productionPlanningId",
        onDelete: "CASCADE",
      });
      productionPlannings.hasMany(models.perincians, {
        foreignKey: "productionPlanningId",
        onDelete: "CASCADE",
      });
    }
  }
  productionPlannings.init(
    {
      pemesan: DataTypes.STRING,
      alamatKirimBarang: DataTypes.STRING,
      tanggalPengirimanBarang: DataTypes.STRING,
      jenisCetakan: DataTypes.STRING,
      ukuran: DataTypes.STRING,
      kuantitas: DataTypes.STRING,
      isiPerBox: DataTypes.STRING,
      ply: DataTypes.STRING,
      seri: DataTypes.STRING,
      nomorator: DataTypes.STRING,
      contoh: DataTypes.BOOLEAN,
      plate: DataTypes.BOOLEAN,
      setting: DataTypes.BOOLEAN,
      orderId: DataTypes.INTEGER,
      statusProductionPlanning: DataTypes.STRING,
      statusPajakKeluaran: DataTypes.STRING,
      lokasi: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "productionPlannings",
    }
  );
  return productionPlannings;
};
