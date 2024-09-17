"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cicilanPemLains extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      cicilanPemLains.belongsTo(models.pembayaranLains, {
        foreignKey: "pembayaranLainId",
        onDelete: "CASCADE",
      });
    }
  }
  cicilanPemLains.init(
    {
      pembayaranLainId: DataTypes.INTEGER,
      tanggal: DataTypes.STRING,
      jumlahHarga: DataTypes.STRING,
      tanggalJatuhTempo: DataTypes.STRING,
      statusCicilan: DataTypes.STRING,
      noRekening: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "cicilanPemLains",
    }
  );
  return cicilanPemLains;
};
