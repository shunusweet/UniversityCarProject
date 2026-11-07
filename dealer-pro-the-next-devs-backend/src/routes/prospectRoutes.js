
// /routes/ProspectingListRoutes.js

const express = require('express');
const router = express.Router();
const {
  createProspectingList,
  getAllProspectingLists,
  getProspectingListById,
  deleteProspectingList,
} = require('../controllers/prospectController');

// Route to create a new prospecting list
router.post('/prospecting-lists', createProspectingList);

// Route to get all prospecting lists
router.get('/prospecting-lists', getAllProspectingLists);

// Route to get a specific prospecting list by ID
router.get('/prospecting-lists/:id', getProspectingListById);

// Route to delete a prospecting list by ID
router.delete('/prospecting-lists/:id', deleteProspectingList);

module.exports = router;
