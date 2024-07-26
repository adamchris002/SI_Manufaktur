"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class inventorys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      inventorys.belongsToMany(models.users, {
        through: "UserInventorys",
      });
      inventorys.hasMany(models.inventoryHistorys, {
        foreignKey: "inventoryId",
        onDelete: "CASCADE",
      });
    }
  }
  inventorys.init(
    {
      namaItem: DataTypes.STRING,
      kodeBarang: DataTypes.STRING,
      rincianItem: DataTypes.STRING,
      jumlahItem: DataTypes.STRING,
      lokasi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "inventorys",
    }
  );
  return inventorys;
};
