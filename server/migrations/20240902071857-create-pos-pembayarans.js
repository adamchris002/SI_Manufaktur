'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posPembayarans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kasHarianId: {
        type: Sequelize.INTEGER,
        references: { model: "kasHarians", key: "id" },
        onDelete: "CASCADE",
      },
      kode: {
        type: Sequelize.STRING
      },
      uraian: {
        type: Sequelize.STRING
      },
      kataKunci: {
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
    await queryInterface.dropTable('posPembayarans');
  }
};