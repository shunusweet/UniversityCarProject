const express = require('express');
const router = express.Router();
const { scrapeCompanies } = require('../controllers/scrapController');

// Scrape companies from Allabolag API
// Accepts query parameters like: location, employees_min, employees_max, revenue_min, revenue_max, profit_min, profit_max, etc.
router.post('/companies', scrapeCompanies);

module.exports = router;
