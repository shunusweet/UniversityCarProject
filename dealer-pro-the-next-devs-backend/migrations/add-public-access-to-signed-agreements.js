// Migration to add public access fields to SignedAgreement table
// Run this migration: npx sequelize-cli db:migrate

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("SignedAgreements", "isPublicAccess", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });

    await queryInterface.addColumn("SignedAgreements", "accessToken", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Add index on accessToken for faster lookups
    await queryInterface.addIndex("SignedAgreements", ["accessToken"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("SignedAgreements", "isPublicAccess");
    await queryInterface.removeColumn("SignedAgreements", "accessToken");
  },
};
