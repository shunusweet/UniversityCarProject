'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add all potentially missing columns
    const addColumns = [];

    // Required fields
    addColumns.push(queryInterface.addColumn('vehicles', 'registrationNumber', {
      type: Sequelize.STRING,
      allowNull: false,
    }).catch(err => console.log('Column registrationNumber might already exist')));

    addColumns.push(queryInterface.addColumn('vehicles', 'model', {
      type: Sequelize.STRING,
      allowNull: false,
    }).catch(err => console.log('Column model might already exist')));

    addColumns.push(queryInterface.addColumn('vehicles', 'vehicleName', {
      type: Sequelize.STRING,
      allowNull: false,
    }).catch(err => console.log('Column vehicleName might already exist')));

    addColumns.push(queryInterface.addColumn('vehicles', 'year', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }).catch(err => console.log('Column year might already exist')));

    addColumns.push(queryInterface.addColumn('vehicles', 'corp_Id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }).catch(err => console.log('Column corp_Id might already exist')));

    // Optional fields
    const optionalColumns = [
      'category', 'status', 'importOrigin', 'registrationDate', 'price',
      'mileage', 'daysInStock', 'fuelType', 'gearbox', 'drive', 'color',
      'horsepower', 'notes', 'outlay', 'equipment', 'documents', 'type',
      'chassisNumber', 'preRegistrationDate', 'registrationRenewed',
      'statusDate', 'engineVolume', 'maxSpeed', 'serviceWeight',
      'totalWeight', 'vehicleWeight', 'passengers'
    ];

    optionalColumns.forEach(column => {
      addColumns.push(queryInterface.addColumn('vehicles', column, {
        type: column.endsWith('Date') ? Sequelize.DATE :
              column.includes('Weight') || column === 'price' || column === 'mileage' || 
              column === 'daysInStock' || column === 'passengers' ? Sequelize.INTEGER :
              column === 'notes' || column === 'outlay' || column === 'equipment' || 
              column === 'documents' ? Sequelize.JSON :
              Sequelize.STRING,
        allowNull: true,
      }).catch(err => console.log(`Column ${column} might already exist`)));
    });

    await Promise.all(addColumns);
  },

  down: async (queryInterface, Sequelize) => {
    const dropColumns = [
      'registrationNumber', 'model', 'vehicleName', 'year', 'corp_Id',
      'category', 'status', 'importOrigin', 'registrationDate', 'price',
      'mileage', 'daysInStock', 'fuelType', 'gearbox', 'drive', 'color',
      'horsepower', 'notes', 'outlay', 'equipment', 'documents', 'type',
      'chassisNumber', 'preRegistrationDate', 'registrationRenewed',
      'statusDate', 'engineVolume', 'maxSpeed', 'serviceWeight',
      'totalWeight', 'vehicleWeight', 'passengers'
    ];

    await Promise.all(dropColumns.map(column => 
      queryInterface.removeColumn('vehicles', column).catch(err => 
        console.log(`Column ${column} might not exist`)
      )
    ));
  }
};