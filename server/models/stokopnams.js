"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stokOpnams extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      stokOpnams.belongsToMany(models.users, { through: "UserStokOpnams" });
      stokOpnams.hasMany(models.itemStokOpnams, {
        foreignKey: "stokOpnamId",
        onDelete: "CASCADE",
      });
    }
  }
  stokOpnams.init(
    {
      judulStokOpnam: DataTypes.STRING,
      tanggalStokOpnam: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "stokOpnams",
    }
  );
  return stokOpnams;
};
