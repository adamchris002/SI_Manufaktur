"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("itemLaporanLimbahProduksis", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      laporanLimbahProduksiId: {
        type: Sequelize.INTEGER,
        references: {
          model: "laporanLimbahProduksis",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      noOrderProduksiId: {
        type: Sequelize.INTEGER,
      },
      namaBarang: {
        type: Sequelize.STRING,
      },
      jumlahBarang: {
        type: Sequelize.STRING,
      },
      keterangan: {
        type: Sequelize.STRING,
      },
      tahapProduksi: {
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
    await queryInterface.dropTable("itemLaporanLimbahProduksis");
  },
};
