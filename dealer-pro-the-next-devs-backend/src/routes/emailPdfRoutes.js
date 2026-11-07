const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sendEmailWithPdf,sendEmailWithBankIDLink } = require('../controllers/emailPdfController');

const upload = multer({ dest: 'uploads/' });

router.post('/sendpdf', upload.single('pdf'), sendEmailWithPdf);
router.post('/send-bankid-link', sendEmailWithBankIDLink);

module.exports = router;