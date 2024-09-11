"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pajakMasukans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      bukuBankId: {
        type: Sequelize.INTEGER,
        references: { model: "bukuBanks", key: "id" },
        onDelete: "CASCADE",
      },
      tanggal: {
        type: Sequelize.STRING,
      },
      leveransir: {
        type: Sequelize.STRING,
      },
      noTglOrder: {
        type: Sequelize.STRING,
      },
      jenisBarang: {
        type: Sequelize.STRING,
      },
      kuantitas: {
        type: Sequelize.STRING,
      },
      hargaSatuan: {
        type: Sequelize.STRING,
      },
      jumlahHarga: {
        type: Sequelize.STRING,
      },
      noInvoiceKwitansiSj: {
        type: Sequelize.STRING,
      },
      noSeriFakturPajak: {
        type: Sequelize.STRING,
      },
      dpp: {
        type: Sequelize.STRING,
      },
      ppn: {
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
    await queryInterface.dropTable("pajakMasukans");
  },
};
