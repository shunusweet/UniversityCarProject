// src/routes/receiptRoutes.js
const express = require('express');
const router = express.Router();

// ✅ Destructured Controller Functions
const {
  createReceipt,
  getTotalReceiptCount,
  updateReceipt,
  getSingleReceipt,
  getAllReceipts,
  deleteReceipt,
} = require('../controllers/receiptController');

// ✅ Auth middleware
const { protect } = require('../middleware/authMiddleware');

// ✅ Routes using destructured methods
// router.post('/create', protect, createReceipt);
// router.get('/count', protect, getTotalReceiptCount);
// router.put('/update/:id', protect, updateReceipt);
router.get('/getSingleReceipt:id', protect, getSingleReceipt);
router.get('/getAllReceipts', protect, getAllReceipts);
// router.delete('/delete/:id', protect, deleteReceipt);

module.exports = router;
