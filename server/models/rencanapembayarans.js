"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class rencanaPembayarans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      rencanaPembayarans.belongsToMany(models.users, {
        through: "UserRencanaPembayarans",
        foreignKey: "rencanaPembayaranId",
        otherKey: "userId",
      });
      rencanaPembayarans.hasMany(models.itemRencanaPembayarans, {
        foreignKey: "rencanaPembayaranId",
        onDelete: "CASCADE",
      });
    }
  }
  rencanaPembayarans.init(
    {
      judulRencanaPembayaran: DataTypes.STRING,
      statusRencanaPembayaran: DataTypes.STRING,
      lokasi: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "rencanaPembayarans",
    }
  );
  return rencanaPembayarans;
};
