"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bahanBakuAkanDigunakans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      estimasiBahanBakuId: {
        type: Sequelize.INTEGER,
        references: {
          model: "estimasiBahanBakus",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      namaJenis: {
        type: Sequelize.STRING,
      },
      groupIndex: {
        type: Sequelize.INTEGER
      },
      dataInformasi: {
        type: Sequelize.STRING,
      },
      warna: {
        type: Sequelize.STRING,
      },
      estimasiKebutuhan: {
        type: Sequelize.STRING,
      },
      waste: {
        type: Sequelize.STRING,
      },
      jumlahKebutuhan: {
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
    await queryInterface.dropTable("bahanBakuAkanDigunakans");
  },
};
