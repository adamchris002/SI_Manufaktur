"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jadwalProduksis", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      laporanProduksiId: {
        type: Sequelize.INTEGER,
        references: {
          model: "laporanProduksis",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      tahapProduksi: {
        type: Sequelize.STRING,
      },
      noOrderProduksi: {
        type: Sequelize.STRING,
      },
      jenisCetakan: {
        type: Sequelize.STRING,
      },
      perolehanCetak: {
        type: Sequelize.STRING,
      },
      waste: {
        type: Sequelize.STRING,
      },
      keterangan: {
        type: Sequelize.STRING,
      },
      jenisBahanKertas: {
        type: Sequelize.STRING,
      },
      kodeRoll: {
        type: Sequelize.STRING,
      },
      beratBahanKertas: {
        type: Sequelize.STRING,
      },
      sobek: {
        type: Sequelize.STRING,
      },
      kulit: {
        type: Sequelize.STRING,
      },
      gelondong: {
        type: Sequelize.STRING,
      },
      sampah: {
        type: Sequelize.STRING,
      },
      rollHabis: {
        type: Sequelize.BOOLEAN,
      },
      rollSisa: {
        type: Sequelize.BOOLEAN,
      },
      nomoratorAwal: {
        type: Sequelize.STRING,
      },
      nomoratorAkhir: {
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
    await queryInterface.dropTable("jadwalProduksis");
  },
};
