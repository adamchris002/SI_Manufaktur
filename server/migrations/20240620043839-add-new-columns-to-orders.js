"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("orders", "orderTotalPrice", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("orders", "orderType", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("orders", "orderNoSeries", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("orders", "orderDueDate", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("orders", "orderTotalPrice");
    await queryInterface.removeColumn("orders", "orderType");
    await queryInterface.removeColumn("orders", "orderNoSeries");
    await queryInterface.removeColumn("orders", "orderDueDate");
  },
};
