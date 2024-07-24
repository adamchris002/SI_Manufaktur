"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("itemPenyerahanBarangs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      penyerahanBarangId: {
        type: Sequelize.INTEGER,
        references: {
          model: "penyerahanBarangs",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      namaBarang: {
        type: Sequelize.STRING,
      },
      kodeBarang: {
        type: Sequelize.STRING,
      },
      rincianItem: {
        type: Sequelize.STRING,
      },
      jumlahYangDiambil: {
        type: Sequelize.STRING,
      },
      selisihBarang: {
        type: Sequelize.STRING,
      },
      lokasiPenyimpanan: {
        type: Sequelize.STRING,
      },
      idBarang: {
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
    await queryInterface.dropTable("itemPenyerahanBarangs");
  },
};
