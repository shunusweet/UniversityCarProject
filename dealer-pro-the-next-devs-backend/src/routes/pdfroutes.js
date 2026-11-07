const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const upload = require('../services/pdfUpload'); // multer config


router.post('/upload', upload.single('file'), pdfController.uploadPdfData);


module.exports = router;
