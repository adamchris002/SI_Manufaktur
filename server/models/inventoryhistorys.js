"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class inventoryHistorys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      inventoryHistorys.belongsTo(models.inventorys, {
        foreignKey: "inventoryId",
        onDelete: "CASCADE",
      });
    }
  }
  inventoryHistorys.init(
    {
      inventoryId: DataTypes.INTEGER,
      suratPesanan: DataTypes.STRING,
      tanggalMasuk: DataTypes.STRING,
      tanggalPengembalian: DataTypes.STRING,
      stokOpnamAwal: DataTypes.STRING,
      stokOpnamAkhir: DataTypes.STRING,
      stokFisik: DataTypes.STRING,
      stokSelisih: DataTypes.STRING,
      keterangan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "inventoryHistorys",
    }
  );
  return inventoryHistorys;
};
