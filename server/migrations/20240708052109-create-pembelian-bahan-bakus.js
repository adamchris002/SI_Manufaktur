"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pembelianBahanBakus", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      permohonanPembelianId: {
        type: Sequelize.INTEGER,
        references: {
          model: "permohonanPembelians",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      leveransir: {
        type: Sequelize.STRING,
      },
      alamat: {
        type: Sequelize.STRING,
      },
      statusPajakMasukan: {
        type: Sequelize.STRING,
      },
      statusHutang: { type: Sequelize.STRING },
      lokasi: {type: Sequelize.STRING},
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
    await queryInterface.dropTable("pembelianBahanBakus");
  },
};
