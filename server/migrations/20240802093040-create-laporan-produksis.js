"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("laporanProduksis", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tanggalProduksi: {
        type: Sequelize.STRING,
      },
      noOrderProduksi: {
        type: Sequelize.STRING,
      },
      idProductionPlanning: {
        type: Sequelize.INTEGER,
      },
      jenisCetakan: {
        type: Sequelize.STRING,
      },
      mesin: {
        type: Sequelize.STRING,
      },
      dibuatOleh: {
        type: Sequelize.STRING,
      },
      tahapProduksi: {
        type: Sequelize.STRING,
      },
      statusLaporan: {
        type: Sequelize.STRING,
      },
      statusLaporanLimbah: {
        type: Sequelize.STRING,
      },
      tanggalPengiriman: {
        type: Sequelize.STRING,
      },
      lokasi: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable("laporanProduksis");
  },
};
