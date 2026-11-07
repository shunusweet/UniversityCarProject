module.exports = (sequelize, DataTypes) => {
  const searchvehiclle = sequelize.define('searchvehiclle', {
    // Required Fields
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: true, // This field must always be provided
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true, // This field must always be provided
    },
    vehicleName: {
      type: DataTypes.STRING,
      allowNull: true, // This field must always be provided
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true, // This field must always be provided
    },
    corp_Id: { type: DataTypes.INTEGER, allowNull: true },

    // Optional Fields
    category: DataTypes.STRING,           // e.g., SUV
    status: DataTypes.STRING,             // e.g., Available/Active/Stock
    importOrigin: DataTypes.STRING,       // e.g., Sweden
    registrationDate: DataTypes.DATE,     // e.g., 2023-01-15
    price: DataTypes.INTEGER,             // e.g., 850000
    mileage: DataTypes.INTEGER,           // e.g., 13085
    daysInStock: DataTypes.INTEGER,       // e.g., 47
    fuelType: DataTypes.STRING,           // e.g., Diesel
    gearbox: DataTypes.STRING,            // e.g., Automatic
    drive: DataTypes.STRING,              // e.g., Four-wheel drive
    color: DataTypes.STRING,              // e.g., Black metallic
    horsepower: DataTypes.STRING,         // e.g., 191 Hk
    
    notes: {
      type: DataTypes.JSON,  // Use JSON to store an array of notes
      allowNull: true,       // Optional field for storing multiple notes
    },

    outlay: {
      type: DataTypes.JSON,
      allowNull: true, // It's optional for each vehicle
    },

    // Equipment (JSON object)
    equipment: {
      type: DataTypes.JSON,
      allowNull: true,  // Optional field for storing structured data
    },

    // Documents (JSON object)
    documents: {
      type: DataTypes.JSON,
      allowNull: true,  // Optional field for storing structured data
    },

    // New Fields from Image & Technical Specifications
    type: {  // e.g., Hardtop
      type: DataTypes.STRING,
      allowNull: true,
    },
    chassisNumber: {  // e.g., WBAJB0C51JB084264
      type: DataTypes.STRING,
      allowNull: true,
    },
    preRegistrationDate: {  // e.g., 2023-11-30
      type: DataTypes.DATE,
      allowNull: true,
    },
    registrationRenewed: {  // e.g., 2024-01-15
      type: DataTypes.DATE,
      allowNull: true,
    },
    statusDate: {  // e.g., 2024-02-01
      type: DataTypes.DATE,
      allowNull: true,
    },
    engineVolume: {  // e.g., 2.0L
      type: DataTypes.STRING,
      allowNull: true,
    },
    maxSpeed: {  // e.g., 250 km/h
      type: DataTypes.STRING,
      allowNull: true,
    },
    serviceWeight: {  // e.g., 1850 kg
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalWeight: {  // e.g., 2200 kg
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    vehicleWeight: {  // e.g., 1650 kg
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    passengers: {  // e.g., 5
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    variant: {  // e.g., Performance
      type: DataTypes.STRING,
      allowNull: true,
    },
    version: {  // e.g., 2.0
      type: DataTypes.STRING,
      allowNull: true,
    },
    typeCode: {  // e.g., LM-2023
      type: DataTypes.STRING,
      allowNull: true,
    },
    ecoCertificate: {  // e.g., Euro 6
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Ownership Information
    currentOwner: {  // e.g., John Smith
      type: DataTypes.STRING,
      allowNull: true,
    },
    acquisitionDate: {  // e.g., 2023-10-01
      type: DataTypes.DATE,
      allowNull: true,
    },
    totalOwners: {  // e.g., 2
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    organizationOwner: {  // e.g., Tesla Motors
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Inspection Details
    lastInspection: {  // e.g., 2024-01-15
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextInspectionDue: {  // e.g., 2024-07-15
      type: DataTypes.DATE,
      allowNull: true,
    },
    inspectionMileage: {  // e.g., 25000 km
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    inspectionStation: {  // e.g., Central Auto Inspection
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Import & Origin Information
    importID: {  // e.g., IMP-2023-001
      type: DataTypes.STRING,
      allowNull: true,
    },
    directImport: {  // e.g., Yes
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'searchvehiclle',  // Table name in the database
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  });

  return searchvehiclle;
};
