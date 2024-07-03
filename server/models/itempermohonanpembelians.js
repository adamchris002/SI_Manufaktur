"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class itemPermohonanPembelians extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      itemPermohonanPembelians.belongsTo(models.permohonanPembelians, {
        foreignKey: "permohonanPembelianId",
        onDelete: "CASCADE",
      });
    }
  }
  itemPermohonanPembelians.init(
    {
      permohonanPembelianId: DataTypes.INTEGER,
      jenisBarang: DataTypes.STRING,
      jumlah: DataTypes.STRING,
      untukPekerjaan: DataTypes.STRING,
      stok: DataTypes.STRING,
      keterangan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "itemPermohonanPembelians",
    }
  );
  return itemPermohonanPembelians;
};
