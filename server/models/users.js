"use strict";
const { Model } = require("sequelize");
const activitylogs = require("./activitylogs");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      users.belongsToMany(models.orders, { through: "UserOrders" });
      users.hasMany(models.orders, { foreignKey: "id" });
      // users.hasMany(models.activityLogs, { foreignKey: "userId" });
      users.belongsToMany(models.activitylogs, { through: "UserActivityLogs" });
      users.belongsToMany(models.productionPlannings, {
        through: "UserProductionPlanning",
      });
      users.hasMany(models.productionPlannings, { foreignKey: "id" });
      users.belongsToMany(models.permohonanPembelians, {
        through: "UserPermohonanPembelians",
      });
      users.hasMany(models.permohonanPembelians, { foreignKey: "id" });
      users.belongsToMany(models.inventorys, { through: "UserInventorys" });
      users.hasMany(models.inventorys, { foreignKey: "id" });
      users.belongsToMany(models.stokOpnams, { through: "UserStokOpnams" });
      users.hasMany(models.stokOpnams, { foreignKey: "id" });
      users.belongsToMany(models.penyerahanBarangs, {
        through: "UserPenyerahanBarangs",
      });
      users.hasMany(models.penyerahanBarangs, { foreignKey: "id" });
      users.belongsToMany(models.laporanProduksis, {
        through: "UserLaporanProduksis",
        foreignKey: "userId",
        otherKey: "laporanProduksiId",
      });
      users.hasMany(models.UserLaporanProduksis, { foreignKey: "userId" });
      users.belongsToMany(models.laporanLimbahProduksis, {
        through: "UserLaporanLimbahProduksis",
        foreignKey: "userId",
        otherKey: "laporanLimbahProduksiId",
      });
      users.hasMany(models.UserLaporanLimbahProduksis, {
        foreignKey: "userId",
      });
      users.belongsToMany(models.bukuBanks, {
        through: "UserBukuBanks",
        foreignKey: "userId",
        otherKey: "bukuBankId",
      });
      users.hasMany(models.UserBukuBanks, {
        foreignKey: "userId",
      });
      users.belongsToMany(models.kasHarians, {
        through: "UserKasHarians",
        foreignKey: "userId",
        otherKey: "kasHarianId",
      });
      users.hasMany(models.UserKasHarians, { foreignKey: "userId" });
      users.belongsToMany(models.rencanaPembayarans, {
        through: "UserRencanaPembayarans",
        foreignKey: "userId",
        otherKey: "rencanaPembayaranId",
      });
      users.hasMany(models.UserRencanaPembayarans, { foreignKey: "userId" });
    }
  }
  users.init(
    {
      userid: DataTypes.INTEGER,
      name: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      department: DataTypes.STRING,
      lokasi: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
