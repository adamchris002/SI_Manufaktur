"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cicilans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      cicilans.belongsTo(models.hutangs, {
        foreignKey: "hutangId",
        onDelete: "CASCADE",
      });
    }
  }
  cicilans.init(
    {
      hutangId: DataTypes.INTEGER,
      tanggal: DataTypes.STRING,
      jumlahHarga: DataTypes.STRING,
      tanggalJatuhTempo: DataTypes.STRING,
      statusCicilan: DataTypes.STRING,
      noRekening: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "cicilans",
    }
  );
  return cicilans;
};
