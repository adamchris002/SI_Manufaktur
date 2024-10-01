"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("laporanSampahs", {
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
      noOrderProduksi: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("laporanSampahs");
  },
};
