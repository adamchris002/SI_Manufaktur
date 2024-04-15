'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class documents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      documents.belongsTo(models.orders)
    }
  }
  documents.init({
    orderId: DataTypes.INTEGER,
    filename: DataTypes.STRING,
    size: DataTypes.INTEGER,
    type: DataTypes.STRING,
    path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'documents',
  });
  return documents;
};