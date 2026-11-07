const searchVehicleController = require('../controllers/searchVehicleController');
const express = require('express');
const router = express.Router();



const { protect } = require('../middleware/authMiddleware');
// const { checkPermission } = require('../middleware/rbacMiddleware');
const upload = require('../services/pdfUpload');
const {
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
} = require('../controllers/searchVehicleController');

// Existing routes...
router.post('/SearchcreateVehicle', protect, SearchcreateVehicle);
router.get('/SearchgetAllVehicles', protect, getAllSearchVehicles);
router.get('/SearchgetVehicles', protect, getSearchVehicles);
router.get('/filter', protect, filterVehicles);
router.get('/allcount', protect, countAllVehicles);
router.get('/getVehicleByRegistrationNumber/:registrationNumber', protect, getVehicleByRegistrationNumber);
// router.put('/updateVehicle/:registrationNumber', protect, updateVehicle);
router.put('/updateVehicle/:registrationNumber',protect,upload.array('documents', 10), 
    SearchupdateVehicle, // still commented, enable when needed

);
router.delete('/deleteVehicle/:registrationNumber', protect, deleteSearchVehicle);

// 👇 Add this route for SFTP inventory export
router.post('/export-inventory',protect, exportInventory);
router.get('/getTotalRevenue', protect, getTotalRevenue);

module.exports = router;
