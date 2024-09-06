"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class rincianCetakans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      rincianCetakans.belongsTo(models.productionPlannings, {
        foreignKey: "productionPlanningId",
        onDelete: "CASCADE",
      });
    }
  }
  rincianCetakans.init(
    {
      productionPlanningId: DataTypes.INTEGER,
      namaCetakan: DataTypes.STRING,
      ukuran: DataTypes.STRING,
      jenisKertas: DataTypes.STRING,
      beratKertas: DataTypes.STRING,
      warna: DataTypes.STRING,
      kuantitas: DataTypes.STRING,
      ply: DataTypes.STRING,
      isi: DataTypes.STRING,
      nomorator: DataTypes.STRING,
      keterangan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "rincianCetakans",
    }
  );
  return rincianCetakans;
};
