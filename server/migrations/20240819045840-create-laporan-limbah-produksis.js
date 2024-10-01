"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("laporanLimbahProduksis", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      noOrderProduksi: {
        type: Sequelize.INTEGER,
      },
      dibuatOleh: {
        type: Sequelize.STRING,
      },
      tanggalPembuatan: {
        type: Sequelize.STRING,
      },
      tahapProduksi: {
        type: Sequelize.STRING,
      },
      lokasi: { type: Sequelize.STRING },
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
    await queryInterface.dropTable("laporanLimbahProduksis");
  },
};
