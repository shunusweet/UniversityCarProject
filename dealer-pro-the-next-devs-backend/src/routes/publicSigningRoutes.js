// publicSigningRoutes.js - New routes for public signing

const express = require("express");
const router = express.Router();
const {
  generatePublicSigningToken,
  getAgreementByIdPublic,
  sendPublicSigningLinkEmail,
  sendPublicSigningLinkSMS,
  sendTestEmail,
} = require("../controllers/publicSigningController");

// Generate public signing token
router.post("/generate-token/:agreementId", generatePublicSigningToken);

// Get agreement data with public token validation
router.get("/getAgreement/:agreementId", getAgreementByIdPublic);

// Send public signing link via email
router.post("/send-email/:agreementId", sendPublicSigningLinkEmail);

// Send public signing link via SMS
router.post("/send-sms/:agreementId", sendPublicSigningLinkSMS);

router.post("/sendTestEmail" ,sendTestEmail)

module.exports = router;
