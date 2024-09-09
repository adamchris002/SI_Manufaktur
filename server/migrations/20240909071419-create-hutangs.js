"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("hutangs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      itemRencanaPembayaranId: {
        type: Sequelize.INTEGER,
        references: { model: "itemRencanaPembayarans", key: "id" },
        onDelete: "CASCADE"
      },
      tanggal: {
        type: Sequelize.STRING,
      },
      jenisBarang: {
        type: Sequelize.STRING,
      },
      noInvoiceKwitansiJs: {
        type: Sequelize.STRING,
      },
      tanggalJatuhTempo: {
        type: Sequelize.STRING,
      },
      pembayaran: {
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
    await queryInterface.dropTable("hutangs");
  },
};
