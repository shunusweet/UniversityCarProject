const express = require("express");
const router = express.Router();

const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  searchCompany,
  getCompanyStats,
} = require("../controllers/companyController");

const { protect } = require("../middleware/authMiddleware.js");
const { checkPermission } = require("../middleware/rbacMiddleware");

// Routes
router.post("/createCompany", protect, checkPermission("COMPANIES", "create"), createCompany);
router.get("/search", protect, checkPermission("COMPANIES", "read"), searchCompany);
router.get("/stats", protect, checkPermission("COMPANIES", "read"), getCompanyStats);
router.get("/getAllCompanies", protect, checkPermission("COMPANIES", "read"), getAllCompanies);
router.get("/getCompanyById:organisationNumber", protect, checkPermission("COMPANIES", "read"), getCompanyById);
router.put("/updateCompany:organisationNumber", protect, checkPermission("COMPANIES", "update"), updateCompany);
router.delete("/deleteCompany:organisationNumber", protect, checkPermission("COMPANIES", "delete"), deleteCompany);

module.exports = router;
