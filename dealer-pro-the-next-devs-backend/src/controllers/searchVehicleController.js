const db = require('../models');
const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');
const SearchVehicle = db.searchvehiclle;
const User = db.User;
const {uploadFiles } = require('../services/uploadMedia.js');

const writeGenFile = require('../utils/writeGenFile.js');
const uploadFileSftp = require('../utils/uploadFileSftp.js');

const SearchcreateVehicle = asyncHandler(async (req, res) => {

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
    importID, directImport
  } = req.body;

  const existing = await SearchVehicle.findOne({
    where: { registrationNumber, corp_Id: user.corpId }
  });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'Vehicle with this registration number already exists'
    });
  }

  const vehicle = await SearchVehicle.create({
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
  });

  res.status(201).json({
    success: true,
    message: 'Vehicle created successfully',
    data: vehicle,
  });
});

const getAllSearchVehicles = asyncHandler(async (req, res) => {
//   console.log('Vehicle model type:', typeof SearchVehicle); // ✅ should print 'function'

  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res.status(400).json({ success: false, message: '`corpId` is required' });
  }

  const vehicles = await SearchVehicle.findAll({
    where: { corp_Id: user.corpId }
  });

  res.status(200).json({ success: true, data: vehicles });
});

const getVehicleByRegistrationNumber = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res.status(400).json({ success: false, message: '`corpId` is required' });
  }

  const vehicle = await SearchVehicle.findOne({
    where: {
      registrationNumber: req.params.registrationNumber,
      corp_Id: user.corpId
    }
  });

  if (!vehicle) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }

  res.status(200).json({ success: true, data: vehicle });
});

// updateVehicle is commented intentionally

const deleteSearchVehicle = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res.status(400).json({ success: false, message: '`corpId` is required' });
  }

  const vehicle = await SearchVehicle.findOne({
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

  const vehicles = await SearchVehicle.findAll({ where: filters });
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

  const vehicles = await SearchVehicle.findAll({
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

    const totalRevenue = await SearchVehicle.sum('price', {
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
const SearchupdateVehicle = asyncHandler(async (req, res) => {
  try {
    const { registrationNumber } = req.params;
    let { notes, outlay } = req.body;

    const vehicle = await SearchVehicle.findOne({ where: { registrationNumber } });
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

const getSearchVehicles = asyncHandler(async (req, res) => {
  console.log('Vehicle model type:', typeof Vehicle); // ✅ should print 'function'

  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res.status(400).json({ success: false, message: '`corpId` is required' });
  }

  const vehicles = await SearchVehicle.findAll({
    where: { corp_Id: user.corpId }
  });

  res.status(200).json({ success: true, data: vehicles });
});

module.exports = {
  SearchcreateVehicle,
  getAllSearchVehicles,
  getVehicleByRegistrationNumber,
  SearchupdateVehicle, // still commented, enable when needed
  deleteSearchVehicle,
  countAllVehicles,
  filterVehicles,
  exportInventory,
  getTotalRevenue,
  getSearchVehicles 
};
