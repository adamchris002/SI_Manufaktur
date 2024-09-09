"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class itemRencanaPembayarans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      itemRencanaPembayarans.belongsTo(models.rencanaPembayarans, {
        foreignKey: "rencanaPembayaranId",
        onDelete: "CASCADE",
      });
      itemRencanaPembayarans.hasMany(models.hutangs, {
        foreignKey: "itemRencanaPembayaranId",
        onDelete: "CASCADE",
      });
    }
  }
  itemRencanaPembayarans.init(
    {
      rencanaPembayaranId: DataTypes.INTEGER,
      uraian: DataTypes.STRING,
      tanggalJatuhTempo: DataTypes.STRING,
      nominal: DataTypes.STRING,
      keterangan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "itemRencanaPembayarans",
    }
  );
  return itemRencanaPembayarans;
};
