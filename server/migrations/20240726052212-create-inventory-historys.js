"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("inventoryHistorys", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      inventoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: "inventorys",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      suratPesanan: {
        type: Sequelize.STRING,
      },
      tanggalMasuk: {
        type: Sequelize.STRING,
      },
      tanggalPengembalian: {
        type: Sequelize.STRING,
      },
      stokOpnamAwal: {
        type: Sequelize.STRING,
      },
      stokOpnamAkhir: {
        type: Sequelize.STRING,
      },
      stokFisik: {
        type: Sequelize.STRING,
      },
      stokSelisih: {
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
    await queryInterface.dropTable("inventoryHistorys");
  },
};
