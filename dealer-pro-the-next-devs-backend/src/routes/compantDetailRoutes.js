const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyDetalController.js');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../services/pdfUpload');
// Create Company Details (Protected Route)
// router.post('/create', protect, companyController.createCompanyDetail);
router.get('/getById/:id', protect, companyController.getByIdCompanyDetail);
router.get("/getCompanyDetailByUser" , protect, companyController.getCompanyDetailByUser);
router.put('/update',protect, upload.single('file'),companyController.updateCompanyDetails 
);

// router.put('/update',protect, companyController.updateCompanyDetails 
// );

module.exports = router;
