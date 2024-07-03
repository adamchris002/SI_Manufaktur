'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('itemPermohonanPembelians', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      permohonanPembelianId: {
        type: Sequelize.INTEGER,
        references: {
          model: "permohonanPembelians",
          key: "id",
        },
        onDelete: "CASCADE"
      },
      jenisBarang: {
        type: Sequelize.STRING
      },
      jumlah: {
        type: Sequelize.STRING
      },
      untukPekerjaan: {
        type: Sequelize.STRING
      },
      stok: {
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
    await queryInterface.dropTable('itemPermohonanPembelians');
  }
};