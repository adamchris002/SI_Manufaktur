"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rincianCetakans", {
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
      namaCetakan: {
        type: Sequelize.STRING,
      },
      ukuran: {
        type: Sequelize.STRING,
      },
      jenisKertas: {
        type: Sequelize.STRING,
      },
      beratKertas: {
        type: Sequelize.STRING,
      },
      warna: {
        type: Sequelize.STRING,
      },
      kuantitas: {
        type: Sequelize.STRING,
      },
      ply: {
        type: Sequelize.STRING,
      },
      isi: {
        type: Sequelize.STRING,
      },
      nomorator: {
        type: Sequelize.STRING,
      },
      keterangan: {
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
    await queryInterface.dropTable("rincianCetakans");
  },
};
