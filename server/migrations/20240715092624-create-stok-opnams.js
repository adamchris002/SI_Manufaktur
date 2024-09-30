"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("stokOpnams", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      judulStokOpnam: {
        type: Sequelize.STRING,
      },
      tanggalStokOpnam: {
        type: Sequelize.STRING,
      },
      tanggalAkhirStokOpnam: {
        type: Sequelize.STRING,
      },
      statusStokOpnam: {
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
    await queryInterface.dropTable("stokOpnams");
  },
};
