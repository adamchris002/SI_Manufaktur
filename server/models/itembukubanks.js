"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class itemBukuBanks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      itemBukuBanks.belongsTo(models.bukuBanks, {
        foreignKey: "bukuBankId",
        onDelete: "CASCADE",
      });
    }
  }
  itemBukuBanks.init(
    {
      bukuBankId: DataTypes.INTEGER,
      tanggal: DataTypes.STRING,
      uraian: DataTypes.STRING,
      debet: DataTypes.STRING,
      kredit: DataTypes.STRING,
      saldo: DataTypes.STRING,
      keterangan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "itemBukuBanks",
    }
  );
  return itemBukuBanks;
};
