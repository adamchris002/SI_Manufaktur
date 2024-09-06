'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class perincians extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      perincians.belongsTo(models.productionPlannings, {
        foreignKey: "productionPlanningId",
        onDelete: "CASCADE",
      });
    }
  }
  perincians.init({
    productionPlanningId: DataTypes.INTEGER,
    namaRekanan: DataTypes.STRING,
    keterangan: DataTypes.STRING,
    jenisCetakan: DataTypes.STRING,
    isi: DataTypes.STRING,
    harga: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'perincians',
  });
  return perincians;
};