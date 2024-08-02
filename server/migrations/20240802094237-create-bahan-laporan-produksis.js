'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bahanLaporanProduksis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        type: Sequelize.STRING
      },
      jenis: {
        type: Sequelize.STRING
      },
      kode: {
        type: Sequelize.STRING
      },
      beratAwal: {
        type: Sequelize.STRING
      },
      beratAkhir: {
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
    await queryInterface.dropTable('bahanLaporanProduksis');
  }
};