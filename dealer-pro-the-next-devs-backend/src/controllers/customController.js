

const db = require('../models/index.js')
const Customer = db.customer;
const User = db.User;
const { Op } = require('sequelize');

const asyncHandler = require('express-async-handler');
const crypto = require('crypto');

const createCustomer = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    telephone,
    address,
    type,
    status,
    socialSecurityNumber,
    postalCode,
    customerNumber,
    location
  } = req.body;

  // 1) load user & corp
  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res
      .status(400)
      .json({ success: false, message: '`corpId` is required' });
  }

  // 2) validate required fields
  if (!name || !email || !telephone || !address || !socialSecurityNumber) {
    return res
      .status(400)
      .json({ success: false, message: 'Please provide all required fields' });
  }

  // 3) check duplicate email within this corp
  const existing = await Customer.findOne({
    where: { email, corpId: user.corpId }
  });
  if (existing) {
    return res
      .status(400)
      .json({ success: false, message: 'Customer with this email already exists' });
  }

  // 4) create
  const customer = await Customer.create({
    customerId: crypto.randomUUID(),
    userId:    user.id,
    name,
    email,
    telephone,
    address,
    type,
    status,
    socialSecurityNumber,
    postalCode,
    customerNumber,
    location
  });

  res
    .status(201)
    .json({ success: true, data: customer, message: 'Customer created successfully' });
});


const getAllCustomers = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res
      .status(400)
      .json({ success: false, message: '`corpId` is required' });
  }

  // pagination & filters
  const page      = parseInt(req.query.page)  || 1;
  const limit     = parseInt(req.query.limit) || 10;
  const offset    = (page - 1) * limit;
  const {
    searchTerm,
    statusAdv,
    typeAdv,
    fromDate,
    toDate
  } = req.query;

  // build where, always include corpId
  const where = { corpId: user.corpId };

  if (searchTerm) {
    where[Op.or] = [
      { name:    { [Op.iLike]: `%${searchTerm}%` } },
      { email:   { [Op.iLike]: `%${searchTerm}%` } },
      { address: { [Op.iLike]: `%${searchTerm}%` } }
    ];
  }
  if (statusAdv) where.status = statusAdv;
  if (typeAdv)   where.type   = typeAdv;
  if (fromDate && toDate) {
    where.latestPurchase = { [Op.between]: [fromDate, toDate] };
  } else if (fromDate) {
    where.latestPurchase = { [Op.gte]: fromDate };
  } else if (toDate) {
    where.latestPurchase = { [Op.lte]: toDate };
  }

  const { count: totalItems, rows: customers } = await Customer.findAndCountAll({
    where,
    offset,
    limit,
    order: [['name', 'ASC']]
  });

  // stats for this corp only
  const [ privateCustomers, companyCustomers,
          purchaseAgreements, salesAgreements,
          otherAgreements ] = await Promise.all([
    Customer.count({ where: { corpId: user.corpId, type: 'Private' } }),
    Customer.count({ where: { corpId: user.corpId, type: 'Company' } }),
    Customer.count({ where: { corpId: user.corpId, agreementType: 'Purchase' } }),
    Customer.count({ where: { corpId: user.corpId, agreementType: 'Sale' } }),
    Customer.count({
      where: {
        corpId: user.corpId,
        agreementType: { [Op.notIn]: ['Purchase','Sale',null] }
      }
    })
  ]);

  res.json({
    success: true,
    data: customers,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page,
    stats: {
      privateCustomers,
      companyCustomers,
      totalCustomers: totalItems,
      purchaseAgreements,
      salesAgreements,
      otherAgreements
    }
  });
});


const deleteCustomer = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res
      .status(400)
      .json({ success: false, message: '`corpId` is required' });
  }

  const { customerId } = req.params;
  const customer = await Customer.findOne({
    where: { customerId, corpId: user.corpId }
  });
  if (!customer) {
    return res
      .status(404)
      .json({ success: false, message: 'Customer not found' });
  }

  await customer.destroy();
  res.json({ success: true, message: 'Customer deleted successfully', data: customer });
});


const getCustomerById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res
      .status(400)
      .json({ success: false, message: '`corpId` is required' });
  }

  const { customerNumber } = req.params;
  const customer = await Customer.findOne({
    where: { customerId: customerNumber, corpId: user.corpId },
    attributes: { exclude: ['id','corpId','userId'] }
  });

  if (!customer) {
    return res
      .status(404)
      .json({ success: false, message: 'Customer not found' });
  }

  res.json({ success: true, data: customer });
});


module.exports = {
  createCustomer,
  getAllCustomers,
  deleteCustomer,
  getCustomerById
};
