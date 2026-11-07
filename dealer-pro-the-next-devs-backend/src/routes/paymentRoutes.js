const express = require('express');
const router = express.Router();
const {
  createPayment,
  updatePayment,
  getPayment,
  deletePayment,
  getAllPayments,
  getPaymentCount,
  getCustomerContactInfo,
  getRecentPayments
} = require('../controllers/paymentController');

// Import your protect middleware
const { protect } = require('../middleware/authMiddleware');

// Add protect middleware to each route
router.post('/createPayment', protect, createPayment);
router.put('/updatePayment/:id', protect, updatePayment);
router.get('/getPayment/:id', protect, getPayment);
router.delete('/deletePayment/:id', protect, deletePayment);
router.get('/getAllPayments', protect, getAllPayments);
router.get('/count/all', protect, getPaymentCount);
// router.get("/getCustomerContactInfo/:id" , getCustomerContactInfo);
router.get("/getCustomerContactInfo/:social_security_number", getCustomerContactInfo);
router.get('/recent-payments', protect, getRecentPayments);

module.exports = router;
