"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class posPembayarans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      posPembayarans.belongsTo(models.kasHarians, {
        foreignKey: "kasHarianId",
        onDelete: "CASCADE",
      });
    }
  }
  posPembayarans.init(
    {
      kasHarianId: DataTypes.INTEGER,
      kode: DataTypes.STRING,
      uraian: DataTypes.STRING,
      kataKunci: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "posPembayarans",
    }
  );
  return posPembayarans;
};
