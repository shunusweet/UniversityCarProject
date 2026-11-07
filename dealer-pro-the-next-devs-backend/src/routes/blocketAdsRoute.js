const blocketController = require('../controllers/blocketController.js');
const express = require('express');
const router = require('express').Router();


router.post("/ads", blocketController.createAd);
router.get("/ads/:source_id", blocketController.getAdStatus);
router.put("/ads/:source_id", blocketController.updateAd);
router.delete("/ads/:source_id", blocketController.deleteAd);
router.get("/ads/:source_id/bump", blocketController.bumpAd);

module.exports = router;