const db = require('../models');
const asyncHandler = require('express-async-handler');
const Payment = db.Payment;
const User = db.User;

// ✅ Create Payment
const createPayment = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const payment = await Payment.create({
      ...req.body,
      corp_Id: user.corpId
    });
    res.status(201).json({ success: true, message: 'Payment created successfully', data: payment });
  } catch (error) {
    console.error("Payment Creation Error:", error);
    res.status(500).json({ success: false, message: 'Error creating payment', error: error.message });
  }
});

// ✅ Update Payment
const updatePayment = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const id = req.params.id;
    const [updated] = await Payment.update(req.body, { where: { id, corp_Id: user.corpId } });

    if (updated === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found or not authorized' });
    }
    res.status(200).json({ success: true, message: 'Payment updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating payment', error: error.message });
  }
});

// ✅ Get Single Payment
const getPayment = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const payment = await Payment.findOne({ where: { id: req.params.id, corp_Id: user.corpId } });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving payment', error: error.message });
  }
});

// ✅ Delete Payment
const deletePayment = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const deleted = await Payment.destroy({ where: { id: req.params.id, corp_Id: user.corpId } });
    if (deleted === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found or not authorized' });
    }
    res.status(200).json({ success: true, message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting payment', error: error.message });
  }
});

// ✅ Get All Payments
const getAllPayments = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const payments = await Payment.findAll({ where: { corp_Id: user.corpId } });
    if (!payments) {
      return ({ success: true, message: 'No payments found' });
    }
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'No payments found' });
  }
});

// ✅ Count All Payments
const getPaymentCount = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const count = await Payment.count({ where: { corp_Id: user.corpId } });
    res.status(200).json({ success: true, total: count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error counting payments', error: error.message });
  }
});

// ✅ Get Contact Info by SSN
const getCustomerContactInfo = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const ssn = req.params.social_security_number;
    const payment = await Payment.findOne({
      where: { social_security_number: ssn, corp_Id: user.corpId },
      attributes: ['customer_name', 'telephone_number']
    });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found for given SSN' });
    }
    res.status(200).json({
      success: true,
      data: {
        customer_name: payment.customer_name,
        telephone_number: payment.telephone_number
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving customer contact info', error: error.message });
  }
});

// ✅ Get Recent Payments
const getRecentPayments = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const payments = await Payment.findAll({
      where: { corp_Id: user.corpId },
      order: [['createdAt', 'DESC']],
      limit: 10,
      attributes: ['id', 'customer_name', 'total_amount', 'payment_category', 'createdAt']
    });
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error('Recent payments error:', error);
    res.status(500).json({ success: false, message: 'Error fetching recent payments' });
  }
});

module.exports = {
  createPayment,
  updatePayment,
  getPayment,
  deletePayment,
  getAllPayments,
  getPaymentCount,
  getCustomerContactInfo,
  getRecentPayments
};
