const express = require('express');
const router = express.Router();
const { getAllCustomers, createCustomer, deleteCustomer, getCustomerById } = require('../controllers/customController.js');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

router.get('/getAllCustomers', protect,  getAllCustomers);
router.post('/createCustomer', protect,  createCustomer);
// router.delete('/deleteCustomer:customerId', protect, checkPermission('CUSTOMERS', 'delete'), deleteCustomer);
router.get('/search/:customerNumber', protect, checkPermission('CUSTOMERS', 'read'), getCustomerById);
router.delete('/deleteCustomer/:customerId', protect, checkPermission('CUSTOMERS', 'delete'), deleteCustomer);

module.exports = router;
