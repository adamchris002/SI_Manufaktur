"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserPermohonanPembelians extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserPermohonanPembelians.belongsTo(models.users, {
        foreignKey: "userId",
      });
      UserPermohonanPembelians.belongsTo(models.permohonanPembelians, {
        foreignKey: "permohonanPembelianId",
      });
    }
  }
  UserPermohonanPembelians.init(
    {
      userId: DataTypes.INTEGER,
      permohonanPembelianId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserPermohonanPembelians",
    }
  );
  return UserPermohonanPembelians;
};
