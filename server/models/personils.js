"use strict";
const { Model, STRING } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class personils extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      personils.belongsTo(models.laporanProduksis, {
        foreignKey: "laporanProduksiId",
        onDelete: "CASCADE",
      });
    }
  }
  personils.init(
    {
      laporanProduksiId: DataTypes.INTEGER,
      tahapProduksi: DataTypes.STRING,
      nama: DataTypes.STRING,
      statusLaporan:STRING
    },
    {
      sequelize,
      modelName: "personils",
    }
  );
  return personils;
};
