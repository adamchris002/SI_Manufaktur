"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("itemPembelianBahanBakus", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pembelianBahanBakuId: {
        type: Sequelize.INTEGER,
        references: {
          model: "pembelianBahanBakus",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      tanggal: {
        type: Sequelize.STRING,
      },
      noOrder: {
        type: Sequelize.STRING,
      },
      jenisBarang: {
        type: Sequelize.STRING,
      },
      rincianBarang: {
        type: Sequelize.STRING,
      },
      jumlahOrder: {
        type: Sequelize.STRING,
      },
      hargaSatuan: {
        type: Sequelize.STRING,
      },
      jumlahHarga: {
        type: Sequelize.STRING,
      },
      tanggalSuratJalan: {
        type: Sequelize.STRING,
      },
      noSuratJalan: {
        type: Sequelize.STRING,
      },
      tanggalTerimaBarang: {
        type: Sequelize.STRING,
      },
      diterimaOleh: {
        type: Sequelize.STRING,
      },
      fakturPajak: {
        type: Sequelize.STRING,
      },
      tanggalJatuhTempo: {
        type: Sequelize.STRING,
      },
      tanggalPengiriman: {
        type: Sequelize.STRING,
      },
      jumlahTerimaPengiriman: {
        type: Sequelize.STRING,
      },
      sisaPengiriman: {
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
    await queryInterface.dropTable("itemPembelianBahanBakus");
  },
};
