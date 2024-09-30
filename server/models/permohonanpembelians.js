"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class permohonanPembelians extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      permohonanPembelians.belongsToMany(models.users, {
        through: "UserPermohonanPembelians",
      });
      permohonanPembelians.hasMany(models.itemPermohonanPembelians, {
        foreignKey: "permohonanPembelianId",
        onDelete: "CASCADE",
      });
      permohonanPembelians.hasOne(models.pembelianBahanBakus, {
        foreignKey: "permohonanPembelianId",
        onDelete: "CASCADE"
      });
    }
  }
  permohonanPembelians.init(
    {
      nomor: DataTypes.STRING,
      perihal: DataTypes.STRING,
      statusPermohonan: DataTypes.STRING,
      lokasi: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "permohonanPembelians",
    }
  );
  return permohonanPembelians;
};
