const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
// ✅ Auth middleware
const { protect } = require('../middleware/authMiddleware');

// Routes (secured with protect)
router.post('/create', protect, invoiceController.createInvoice);
router.get('/count', protect, invoiceController.getTotalInvoiceCount);
router.put('/update/:id', protect, invoiceController.updateInvoice);
// router.get('/:id', protect, invoiceController.getSingleInvoice);
router.get('/getAllInvoices', protect, invoiceController.getAllInvoices);
router.delete('/delete/:id', protect, invoiceController.deleteInvoice);

module.exports = router;
