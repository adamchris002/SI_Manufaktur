"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("itemRencanaPembayarans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      rencanaPembayaranId: {
        type: Sequelize.INTEGER,
        references: { model: "rencanaPembayarans", key: "id" },
        onDelete: "CASCADE",
      },
      uraian: {
        type: Sequelize.STRING,
      },
      tanggalJatuhTempo: {
        type: Sequelize.STRING,
      },
      nominal: {
        type: Sequelize.STRING,
      },
      keterangan: {
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
    await queryInterface.dropTable("itemRencanaPembayarans");
  },
};
