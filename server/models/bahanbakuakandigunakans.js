"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bahanBakuAkanDigunakans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      bahanBakuAkanDigunakans.belongsTo(models.estimasiBahanBakus, {
        foreignKey: "estimasiBahanBakuId",
        onDelete: "CASCADE"
      });
    }
  }
  bahanBakuAkanDigunakans.init(
    {
      estimasiBahanBakuId: DataTypes.INTEGER,
      namaJenis: DataTypes.STRING,
      dataInformasi: DataTypes.STRING,
      warna: DataTypes.STRING,
      estimasiKebutuhan: DataTypes.STRING,
      waste: DataTypes.STRING,
      jumlahKebutuhan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "bahanBakuAkanDigunakans",
    }
  );
  return bahanBakuAkanDigunakans;
};
