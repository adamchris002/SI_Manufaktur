'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jangkaWaktuProduksis", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productionPlanningId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'productionPlannings',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      bagian: {
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
    await queryInterface.dropTable("jangkaWaktuProduksis");
  },
};
