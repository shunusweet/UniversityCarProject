const db = require('../models');
const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');
const Vehicle = db.Vehicle;
const User = db.User;
const {uploadFiles } = require('../services/uploadMedia.js');

const writeGenFile = require('../utils/writeGenFile.js');
const uploadFileSftp = require('../utils/uploadFileSftp.js');

const createVehicle = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res.status(400).json({ success: false, message: '`corpId` is required' });
  }

  const {
    registrationNumber, model, vehicleName, year,
    category, status, importOrigin, registrationDate,
    price, mileage, daysInStock, fuelType, gearbox, drive,
    color, horsepower, notes, outlay, equipment, documents,
    type, chassisNumber, preRegistrationDate, registrationRenewed,
    statusDate, engineVolume, maxSpeed, serviceWeight, totalWeight,
    vehicleWeight, passengers, variant, version, typeCode, ecoCertificate,
    currentOwner, acquisitionDate, totalOwners, organizationOwner,
    lastInspection, nextInspectionDue, inspectionMileage, inspectionStation,
    importID, directImport,
    pageName
  } = req.body;

  try {
    console.log('Checking for existing vehicle:', { registrationNumber, corpId: user.corpId });
    const existing = await Vehicle.findOne({
      where: { registrationNumber, corp_Id: user.corpId },
      attributes: ['id', 'registrationNumber'], // Only select necessary fields
      raw: true
    });
    
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle with this registration number already exists'
      });
    }
  } catch (error) {
    console.error('Error checking for existing vehicle:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking for existing vehicle',
      error: error.message
    });
  }

  const vehicle = await Vehicle.create({
    corp_Id: user.corpId,
    registrationNumber,
    model,
    vehicleName: vehicleName || 'Volvo V50',
    year,
    category,
    status,
    importOrigin,
    registrationDate,
    price,
    mileage,
    daysInStock,
    fuelType,
    gearbox,
    drive,
    color,
    horsepower,
    notes: Array.isArray(notes) ? notes : [],
    outlay: Array.isArray(outlay) ? outlay : [],
    equipment,
    documents: Array.isArray(documents) ? documents : [],
    type,
    chassisNumber,
    preRegistrationDate,
    registrationRenewed,
    statusDate,
    engineVolume,
    maxSpeed,
    serviceWeight,
    totalWeight,
    vehicleWeight,
    passengers,
    variant,
    version,
    typeCode,
    ecoCertificate,
    currentOwner,
    acquisitionDate,
    totalOwners,
    organizationOwner,
    lastInspection,
    nextInspectionDue,
    inspectionMileage,
    inspectionStation,
    importID,
    directImport,
    pageName,
  });

  res.status(201).json({
    success: true,
    message: 'Vehicle created successfully',
    data: vehicle,
  });
});

const getAllVehicles = asyncHandler(async (req, res) => {
  try {
    console.log('Vehicle model type:', typeof Vehicle); 
    console.log('Starting getAllVehicles for user:', req.user.id);

    const user = await User.findByPk(req.user.id);
    if (!user || !user.corpId) {
      return res.status(400).json({ success: false, message: '`corpId` is required' });
    }

    console.log('Fetching vehicles for corpId:', user.corpId);
    const vehicles = await Vehicle.findAll({
      where: { corp_Id: user.corpId },
      raw: true, // This can help with any potential circular reference issues
      attributes: { 
        exclude: ['pageName'] // Exclude the pageName field from the query
      }
    });

    console.log(`Found ${vehicles.length} vehicles`);
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    console.error('Error in getAllVehicles:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching vehicles',
      error: error.message 
    });
  }
});

const getVehicleByRegistrationNumber = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.corpId) {
      return res.status(400).json({ success: false, message: '`corpId` is required' });
    }

    console.log('Searching for vehicle:', {
      registrationNumber: req.params.registrationNumber,
      corpId: user.corpId
    });

    const vehicle = await Vehicle.findOne({
      where: {
        registrationNumber: req.params.registrationNumber,
        corp_Id: user.corpId
      },
      attributes: [
        'registrationNumber', 'model', 'vehicleName', 'year', 'corp_Id',
        'category', 'status', 'price', 'mileage', 'fuelType', 'gearbox',
        'color', 'type'
      ],
      raw: true
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    console.log('Found vehicle:', vehicle);
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicle details',
      error: error.message
    });
  }
});

// updateVehicle is commented intentionally

const deleteVehicle = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res.status(400).json({ success: false, message: '`corpId` is required' });
  }

  const vehicle = await Vehicle.findOne({
    where: {
      registrationNumber: req.params.registrationNumber,
      corp_Id: user.corpId
    }
  });

  if (!vehicle) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }

  await vehicle.destroy();
  res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
});

const countAllVehicles = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res.status(400).json({ success: false, message: '`corpId` is required' });
  }

  const totalVehicles = await Vehicle.count({
    where: { corp_Id: user.corpId }
  });

  res.status(200).json({ success: true, totalVehicles });
});

const filterVehicles = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res.status(400).json({ success: false, message: '`corpId` is required' });
  }

  const filters = { corp_Id: user.corpId };
  if (req.query.vehicleType && req.query.vehicleType !== 'All Types') {
    filters.category = { [Op.like]: req.query.vehicleType };
  }
  if (req.query.status && req.query.status !== 'All Statuses') {
    filters.status = { [Op.like]: req.query.status };
  }
  if (req.query.gearbox && req.query.gearbox !== 'All Gearboxes') {
    filters.gearbox = { [Op.like]: req.query.gearbox };
  }
  if (req.query.mileageFrom && req.query.mileageTo) {
    filters.mileage = { [Op.between]: [req.query.mileageFrom, req.query.mileageTo] };
  }
  if (req.query.yearFrom && req.query.yearTo) {
    filters.year = { [Op.between]: [req.query.yearFrom, req.query.yearTo] };
  }
  if (req.query.fuelType && req.query.fuelType !== 'All Fuel Types') {
    filters.fuelType = { [Op.like]: req.query.fuelType };
  }

  const vehicles = await Vehicle.findAll({ where: filters });
  if (!vehicles.length) {
    return res.status(404).json({ success: false, message: 'No vehicles found matching the criteria' });
  }

  res.status(200).json({ success: true, data: vehicles });
});

const exportInventory = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res.status(400).json({ success: false, message: '`corpId` is required' });
  }

  const vehicles = await Vehicle.findAll({
    where: { corp_Id: user.corpId }
  });

  if (!vehicles.length) {
    return res.status(400).json({ success: false, message: 'No vehicles to export' });
  }

  const fileName = await writeGenFile(vehicles, user.corpId);
  await uploadFileSftp(fileName, `/${fileName}`);
  res.json({ success: true, message: 'Inventory exported and uploaded', fileName });
});

const getTotalRevenue = async (req, res) => {
  try {
    console.log('HIT: GET /getTotalRevenue');

    const user = await User.findByPk(req.user.id);
    if (!user || !user.corpId) {
      return res.status(400).json({ success: false, message: '`corpId` is required' });
    }

    const totalRevenue = await Vehicle.sum('price', {
      where: {
        corp_Id: user.corpId,
        status: 'Sold',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Total revenue calculated successfully',
      totalRevenue: totalRevenue || 0,
    });
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while calculating revenue',
      error: error.message,
    });
  }
};



//updatedcode
const updateVehicle = asyncHandler(async (req, res) => {
  try {
    const { registrationNumber } = req.params;
    let { notes, outlay } = req.body;

    const vehicle = await Vehicle.findOne({ where: { registrationNumber } });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Upload files to S3
    let documents = [];
    if (req.files && req.files.length > 0) {
      const filesToUpload = req.files.map(file => ({
        filename: file.originalname,
        data: file.buffer,
        type: file.mimetype,
      }));

      documents = await uploadFiles(filesToUpload); // returns S3 URLs
    }

    // Parse notes and outlay if sent as JSON string
    notes = notes ? JSON.parse(notes) : [];
    outlay = outlay ? JSON.parse(outlay) : [];

    await vehicle.update({
      ...req.body,
      documents,
      notes,
      outlay,
    });

    res.status(200).json({
      success: true,
      message: 'Vehicle updated',
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating vehicle',
      error: error.message,
    });
  }
});



const getVehicles = asyncHandler(async (req, res) => {
  console.log('Vehicle model type:', typeof Vehicle); // ✅ should print 'function'

  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res.status(400).json({ success: false, message: '`corpId` is required' });
  }

  const vehicles = await Vehicle.findAll({
    where: { corp_Id: user.corpId }
  });

  res.status(200).json({ success: true, data: vehicles });
});

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleByRegistrationNumber,
  updateVehicle, // still commented, enable when needed
  deleteVehicle,
  countAllVehicles,
  filterVehicles,
  exportInventory,
  getTotalRevenue,
  getVehicles
};
