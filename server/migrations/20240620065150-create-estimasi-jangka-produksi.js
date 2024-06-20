'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('estimasiJangkaProduksis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jangkaWaktuProduksiId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'jangkaWaktuProduksis',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      jenisPekerjaan: {
        type: Sequelize.STRING
      },
      tanggalMulai: {
        type: Sequelize.DATE
      },
      tanggalSelesai: {
        type: Sequelize.DATE
      },
      jumlahHari: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('estimasiJangkaProduksis');
  }
};