const express = require('express');

const router = express.Router();
const { createPayout ,getPayoutByInstructionUUID ,getAllPayouts} = require('../controllers/payoutController');
const { protect } = require('../middleware/authMiddleware');

router.post('/swish-cpcapi/api/v1/payouts', protect, createPayout);
router.get('/swish-cpcapi/api/v1/payouts/:instructionUUID', getPayoutByInstructionUUID);
router.get('/getPayouts',  getAllPayouts); // Assuming you want to list all payouts

module.exports = router;
