const db = require('../models');
const asyncHandler = require('express-async-handler');
const Invoice = db.invoice;
const User = db.User; // Assuming you have a User model for fetching user details
// ✅ CREATE
const createInvoice = asyncHandler(async (req, res) => {
  try {
    const {
      invoiceNumber,
      orgNumber,
      status = 'Pending',
      invoiceDate,
      dueDate,
      expirationDate,
      currency = 'SEK',
      language,
      website,
      customerType,
      customerName,
      email,
      telephoneNumber,
      inReference,
      ourReference,
      items,
      net,
      moms,
      amount
    } = req.body;

    // ✅ Pull corp_Id from logged-in user
    const corp_Id = req.user?.corpId;

    if (!corp_Id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Missing corpId from user context',
      });
    }

    const newInvoice = await Invoice.create({
      corp_Id,
      invoiceNumber,
      orgNumber,
      status,
      invoiceDate,
      dueDate,
      expirationDate,
      currency,
      language,
      website,
      customerType,
      customerName,
      email,
      telephoneNumber,
      inReference,
      ourReference,
      items,
      net,
      moms,
      amount
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      invoice: newInvoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating invoice',
      error: error.message,
    });
  }
});


// ✅ UPDATE
const updateInvoice = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const corp_Id = req.user?.corpId;

    const invoice = await Invoice.findOne({ where: { id, corp_Id } });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    await invoice.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Invoice updated successfully',
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating invoice',
      error: error.message,
    });
  }
});


// ✅ GET SINGLE
const getSingleInvoice = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const corp_Id = req.user?.corpId;

    const invoice = await Invoice.findOne({ where: { id, corp_Id } });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.status(200).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching invoice',
      error: error.message,
    });
  }
});


// ✅ GET ALL
// const getAllInvoices = asyncHandler(async (req, res) => {
//   try {
//     const invoices = await Invoice.findAll();
//     res.status(200).json({ success: true, invoices });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching invoices',
//       error: error.message,
//     });
//   }
// });

// ✅ COUNT
const getTotalInvoiceCount = asyncHandler(async (req, res) => {
  try {
    const corp_Id = req.user?.corpId;

    const count = await Invoice.count({ where: { corp_Id } });

    res.status(200).json({ success: true, totalInvoices: count });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error counting invoices',
      error: error.message,
    });
  }
});


// ✅ DELETE
const deleteInvoice = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const corp_Id = req.user?.corpId;

    const invoice = await Invoice.findOne({ where: { id, corp_Id } });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    await invoice.destroy();

    res.status(200).json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting invoice',
      error: error.message,
    });
  }
});


const getAllInvoices = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const invoices = await Invoice.findAll({
      where: { corp_Id: user.corpId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: invoices.length ? "Receipts fetched successfully" : "No receipts found",
      invoices,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching receipts',
      error: error.message,
    });
  }
});





// ✅ EXPORT
module.exports = {
  createInvoice,
  updateInvoice,
  getSingleInvoice,
  getAllInvoices,
  getTotalInvoiceCount,
  deleteInvoice,
};
