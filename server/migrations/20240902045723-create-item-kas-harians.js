"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("itemKasHarians", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      kasHarianId: {
        type: Sequelize.INTEGER,
        references: { model: "kasHarians", key: "id" },
        onDelete: "CASCADE",
    },
      tanggal: {
        type: Sequelize.STRING,
      },
      uraian: {
        type: Sequelize.STRING,
      },
      nomorBp: {
        type: Sequelize.STRING,
      },
      pos: {
        type: Sequelize.STRING,
      },
      debet: {
        type: Sequelize.STRING,
      },
      kredit: {
        type: Sequelize.STRING,
      },
      sisa: {
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
    await queryInterface.dropTable("itemKasHarians");
  },
};
