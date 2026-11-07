//pipeline tested by feroz & recheck5
const express = require("express");
const router = express.Router();
const {
  createAgreement,
  getAllAgreements,
  getAgreementById,
  updateAgreement,
  deleteAgreement,
  countAgreements,
  fetchValitiveAgreements,
  fetchValitiveOrgInfo,
} = require("../controllers/agreementController");

// Import public signing functions
const {
  getAgreementByIdPublic,
  generatePublicSigningToken,
  sendPublicSigningLinkEmail,
  sendPublicSigningLinkSMS,
} = require("../controllers/publicSigningController");

// Import your protect middleware
const { protect } = require("../middleware/authMiddleware");
//testing with teams Sain feroz
// Add protect middleware to each route
router.post("/createAgreement", protect, createAgreement);
router.get("/getAllAgreements", protect, getAllAgreements);
router.get("/getAgreementById/:id", protect, getAgreementById);
// Public access endpoint (no auth required)
router.get("/getAgreementByIdPublic/:id", getAgreementByIdPublic);
// Public signing token generation (requires auth)
router.post("/generate-public-token/:id", protect, generatePublicSigningToken);
// Send public signing links (requires auth)
router.post("/send-public-link-email/:id", protect, sendPublicSigningLinkEmail);
router.post("/send-public-link-sms/:id", protect, sendPublicSigningLinkSMS);
router.put("/updateAgreement/:id", protect, updateAgreement);
router.delete("/deleteAgreement/:id", protect, deleteAgreement);
router.get("/count/all", protect, countAgreements);
router.put("/external/agreements", fetchValitiveAgreements);
// router.put('/search/org/fin-report/request', fetchValitiveOrgFinancialReports);
// router.put('/search/org/fin-report/request', fetchValitiveOrgBasicInfo);
router.put("/search/org/basic-info", fetchValitiveOrgInfo);

module.exports = router;
