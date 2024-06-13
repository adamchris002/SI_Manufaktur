"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("UserActivityLogs", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn("UserActivityLogs", "activityLogsId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn("UserActivityLogs", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("NOW()"),
    });
    await queryInterface.changeColumn("UserActivityLogs", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("NOW()"),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("UserActivityLogs", "userId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn("UserActivityLogs", "activityLogsId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn("UserActivityLogs", "createdAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn("UserActivityLogs", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
};
