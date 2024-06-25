"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rencanaJadwalProduksis", {
      // Correct table name here
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      estimasiJadwalProduksiId: {
        type: Sequelize.INTEGER,
        references: {
          model: "estimasiJadwalProduksis",
          key: "id",
        },
        onDelete: "CASCADE"
      },
      jenisPekerjaan: {
        type: Sequelize.STRING,
      },
      tanggalMulai: {
        type: Sequelize.STRING,
      },
      tanggalSelesai: {
        type: Sequelize.STRING,
      },
      jumlahHari: {
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
    await queryInterface.dropTable("rencanaJadwalProduksis"); // Correct table name here
  },
};
