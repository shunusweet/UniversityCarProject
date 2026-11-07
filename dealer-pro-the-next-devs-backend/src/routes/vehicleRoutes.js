const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
// const { checkPermission } = require('../middleware/rbacMiddleware');
const upload = require('../services/pdfUpload');
const {
  createVehicle,
  getAllVehicles,
  getVehicleByRegistrationNumber,
  updateVehicle,
  deleteVehicle,
  countAllVehicles,
  filterVehicles,
  exportInventory,
  getTotalRevenue,
  getVehicles
} = require('../controllers/vehicleController');

// Existing routes...
router.post('/createVehicle', protect, createVehicle);
router.get('/getAllVehicles', protect, getAllVehicles);
router.get('/getVehicles', protect, getVehicles);
router.get('/filter', protect, filterVehicles);
router.get('/allcount', protect, countAllVehicles);
router.get('/getVehicleByRegistrationNumber/:registrationNumber', protect, getVehicleByRegistrationNumber);
// router.put('/updateVehicle/:registrationNumber', protect, updateVehicle);
router.put('/updateVehicle/:registrationNumber',protect,upload.array('documents', 10), 
  updateVehicle
);
router.delete('/deleteVehicle/:registrationNumber', protect, deleteVehicle);

// 👇 Add this route for SFTP inventory export
router.post('/export-inventory',protect, exportInventory);
router.get('/getTotalRevenue', protect, getTotalRevenue);



module.exports = router;
