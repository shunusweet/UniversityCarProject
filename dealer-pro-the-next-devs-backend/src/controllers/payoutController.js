const db = require('../models/index.js');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const https = require('https');
const axios = require('axios');
const forge = require('node-forge');
 
const Payout = db.payout;
const User   = db.User;
 
const createPayout = asyncHandler(async (req, res) => {
  // 1. Load user and corpId
  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res.status(400).json({ success: false, message: '`corpId` is required' });
  }
 
  try {
    const { payload, callbackUrl, callbackIdentifier } = req.body;
 
    if (!payload) {
      return res.status(400).json({ success: false, message: 'Missing payload in request body' });
    }
 
    const requiredFields = [
      'payoutInstructionUUID',
      'payerPaymentReference',
      'payerAlias',
      'payeeAlias',
      'payeeSSN',
      'amount',
      'currency',
      'payoutType',
      'instructionDate'
    ];
 
    for (const field of requiredFields) {
      if (!payload[field]) {
        return res.status(400).json({ success: false, message: `Missing field: ${field}` });
      }
    }
 
    if (!callbackUrl) {
      return res.status(400).json({ success: false, message: 'Missing callbackUrl' });
    }
 
    // Prevent duplicates within corp
    const existing = await Payout.findOne({
      where: {
        payoutInstructionUUID: payload.payoutInstructionUUID,
        corpId: user.corpId
      }
    });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Payout with this instruction UUID already exists' });
    }
 
    // Load .p12 certificate
    const pfxPath = path.join(__dirname, '../secrets/swish-comm.p12');
    const p12Buffer = fs.readFileSync(pfxPath);
    const p12Der    = forge.util.createBuffer(p12Buffer.toString('binary'));
    const p12Asn1   = forge.asn1.fromDer(p12Der);
    const p12       = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, process.env.SWISHAPI_KEY);
 
    const keyBag = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[forge.pki.oids.pkcs8ShroudedKeyBag][0];
    const privateKey = keyBag.key;
 
    const certBag    = p12.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag][0];
    const cert       = certBag.cert;
    const serialNumber = cert.serialNumber.toUpperCase();
 
    // Filter payload
    const filteredPayload = {};
    for (const key in payload) {
      if (payload[key] !== null && payload[key] !== '') {
        filteredPayload[key] = payload[key];
      }
    }
    filteredPayload.signingCertificateSerialNumber = serialNumber;
 
    // Sign payload
    const jsonPayload = JSON.stringify(filteredPayload);
    const md          = forge.md.sha512.create();
    md.update(jsonPayload, 'utf8');
    const signatureBytes = privateKey.sign(md);
    const signature      = forge.util.encode64(signatureBytes);
 
    // Save to DB with corpId
    const newPayout = await Payout.create({
      ...filteredPayload,
      callbackUrl,
      signature,
      callbackIdentifier,
      corpId: user.corpId
    });
 
    // Prepare final payload for Swish
    const finalPayload = {
      ...filteredPayload,
      callbackUrl,
      signature,
      callbackIdentifier
    };
 
    const httpsAgent = new https.Agent({
      pfx: fs.readFileSync(pfxPath),
      passphrase: process.env.SWISHAPI_KEY,
    });
 
    const swishResponse = await axios.post(
      'https://cpc.getswish.net/swish-cpcapi/api/v1/payouts',
      finalPayload,
      {
        httpsAgent,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
 
    return res.status(201).json({
      success: true,
      message: 'Payout created and sent to Swish successfully',
      data: {
        payout: newPayout,
        swishResponse: swishResponse.data
      }
    });
 
  } catch (error) {
    console.error('❌ Swish Error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Error creating payout or sending to Swish',
      error: error.response?.data || error.message
    });
  }
});
 
// GET all payouts for corp
const getAllPayouts = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res.status(400).json({ success: false, message: '`corpId` is required' });
  }
 
  try {
    const payouts = await Payout.findAll({ where: { corpId: user.corpId } });
    if (!payouts.length) {
      return res.status(404).json({ success: false, message: 'No payouts found' });
    }
    return res.status(200).json({ success: true, data: payouts });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching payouts',
      error: error.message
    });
  }
});
 
// GET by instruction UUID for corp
const getPayoutByInstructionUUID = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user || !user.corpId) {
    return res.status(400).json({ success: false, message: '`corpId` is required' });
  }
 
  try {
    const { instructionUUID } = req.params;
    if (!instructionUUID) {
      return res.status(400).json({ success: false, message: 'Instruction UUID is required' });
    }
 
    const payout = await Payout.findOne({
      where: {
        payoutInstructionUUID: instructionUUID,
        corpId: user.corpId
      }
    });
 
    if (!payout) {
      return res.status(404).json({ success: false, message: 'Payout not found for the given instruction UUID' });
    }
 
    return res.status(200).json({ success: true, data: payout });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching payout by instruction UUID',
      error: error.message
    });
  }
});
 
module.exports = {
  createPayout,
  getAllPayouts,
  getPayoutByInstructionUUID
};

 
 
 