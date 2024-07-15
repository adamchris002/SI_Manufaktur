"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("itemStokOpnams", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      stokOpnamId: {
        type: Sequelize.INTEGER,
        references: {
          model: "stokOpnams",
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
      jenisBarang: {
        type: Sequelize.STRING,
      },
      kodeBarang: {
        type: Sequelize.STRING,
      },
      lokasiPenyimpanan: {
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
    await queryInterface.dropTable("itemStokOpnams");
  },
};
