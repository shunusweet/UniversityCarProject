'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Add missing vehicle-related columns
      await queryInterface.addColumn('agreements', 'vehicleBrand', {
        type: Sequelize.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('agreements', 'vehicleModel', {
        type: Sequelize.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('agreements', 'salesPriceSEK', {
        type: Sequelize.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('agreements', 'tires', {
        type: Sequelize.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('agreements', 'insuranceType', {
        type: Sequelize.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('agreements', 'freeTextMessage', {
        type: Sequelize.STRING,
        allowNull: true
      });

      console.log('Added vehicle-related columns successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('Error adding columns:', error);
      return Promise.reject(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('agreements', 'vehicleBrand');
      await queryInterface.removeColumn('agreements', 'vehicleModel');
      await queryInterface.removeColumn('agreements', 'salesPriceSEK');
      await queryInterface.removeColumn('agreements', 'tires');
      await queryInterface.removeColumn('agreements', 'insuranceType');
      await queryInterface.removeColumn('agreements', 'freeTextMessage');
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
};