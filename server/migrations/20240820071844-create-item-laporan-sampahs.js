"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("itemLaporanSampahs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      laporanSampahId: {
        type: Sequelize.INTEGER,
        references: { model: "laporanSampahs", key: "id" },
        onDelete: "CASCADE",
      },
      noOrderProduksi: {
        type: Sequelize.INTEGER,
      },
      tahapProduksi: {
        type: Sequelize.STRING,
      },
      tanggal: {
        type: Sequelize.STRING,
      },
      pembeli: {
        type: Sequelize.STRING,
      },
      uraian: {
        type: Sequelize.STRING,
      },
      jumlah: {
        type: Sequelize.STRING,
      },
      hargaSatuan: {
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
    await queryInterface.dropTable("itemLaporanSampahs");
  },
};
