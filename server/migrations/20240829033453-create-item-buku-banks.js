'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('itemBukuBanks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bukuBankId: {
        type: Sequelize.INTEGER,
        references: { model: "bukuBanks", key: "id" },
        onDelete: "CASCADE",
      },
      tanggal: {
        type: Sequelize.STRING
      },
      uraian: {
        type: Sequelize.STRING
      },
      debet: {
        type: Sequelize.STRING
      },
      kredit: {
        type: Sequelize.STRING
      },
      saldo: {
        type: Sequelize.STRING
      },
      keterangan: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('itemBukuBanks');
  }
};