"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("penyerahanBarangs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      orderId: {
        type: Sequelize.INTEGER,
      },
      productionPlanningId: {
        type: Sequelize.INTEGER,
      },
      diambilOleh: {
        type: Sequelize.STRING,
      },
      tanggalPengambilan: {
        type: Sequelize.STRING,
      },
      tanggalPenyerahan: {
        type: Sequelize.STRING,
      },
      statusPenyerahan: {
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
    await queryInterface.dropTable("penyerahanBarangs");
  },
};
