"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cicilans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      hutangId: {
        type: Sequelize.INTEGER,
        references: { model: "hutangs", key: "id" },
        onDelete: "CASCADE",
      },
      tanggal: {
        type: Sequelize.STRING,
      },
      jumlahHarga: {
        type: Sequelize.STRING,
      },
      tanggalJatuhTempo: {
        type: Sequelize.STRING,
      },
      statusCicilan: {
        type: Sequelize.STRING,
      },
      noRekening: {
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
    await queryInterface.dropTable("cicilans");
  },
};
