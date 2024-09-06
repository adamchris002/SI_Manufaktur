"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("perincians", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productionPlanningId: {
        type: Sequelize.INTEGER,
        references: { model: "productionPlannings", key: "id" },
        onDelete: "CASCADE",
      },
      namaRekanan: {
        type: Sequelize.STRING,
      },
      keterangan: {
        type: Sequelize.STRING,
      },
      jenisCetakan: {
        type: Sequelize.STRING,
      },
      isi: {
        type: Sequelize.STRING,
      },
      harga: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("perincians");
  },
};
