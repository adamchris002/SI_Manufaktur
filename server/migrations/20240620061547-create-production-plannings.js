'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productionPlannings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pemesan: {
        type: Sequelize.STRING
      },
      alamatKirimBarang: {
        type: Sequelize.STRING
      },
      tanggalPengirimanBarang: {
        type: Sequelize.STRING
      },
      jenisCetakan: {
        type: Sequelize.STRING
      },
      ukuran: {
        type: Sequelize.STRING
      },
      kuantitas: {
        type: Sequelize.STRING
      },
      isiPerBox: {
        type: Sequelize.STRING
      },
      ply: {
        type: Sequelize.STRING
      },
      seri: {
        type: Sequelize.STRING
      },
      nomorator: {
        type: Sequelize.STRING
      },
      contoh: {
        type: Sequelize.BOOLEAN
      },
      plate: {
        type: Sequelize.BOOLEAN
      },
      setting: {
        type: Sequelize.BOOLEAN
      },
      orderId: {
        type: Sequelize.INTEGER
      },
      statusProductionPlanning: {
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
    await queryInterface.dropTable('productionPlannings');
  }
};
