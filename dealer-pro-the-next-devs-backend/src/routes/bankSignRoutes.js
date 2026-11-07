const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { optionalAuth } = require("../middleware/optionalAuthMiddleware");

const router = express.Router();
const {
  startBankSign,
  checkBankSignStatus,
  sendBankIdLinkSMS,
  getAllAgreementsStatus,
} = require("../controllers/bankSignController");

// Use optional auth for routes that support public access
router.post("/start", protect, startBankSign);

router.post("/status", protect, checkBankSignStatus);

router.post("/sendBankIdLinkSMS",protect, sendBankIdLinkSMS);

router.get("/getallagreementstatus", protect, getAllAgreementsStatus);

module.exports = router;