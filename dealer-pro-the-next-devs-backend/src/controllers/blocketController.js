// controllers/adController.js
const blocketApi = require("../utils/blocketApi.js");
const { ads: Ads } = require("../models");


const createAd = async (req, res) => {
  try {
    const adData = req.body;

    // Save in DB first
    const createdAd = await Ads.create({
      source_id: adData.source_id,
      category_id: adData.category_id
    });

    // Call Blocket API
    const response = await blocketApi.createAd(adData);
    const payload = response.data;

    // Update with response
    await createdAd.update({
      blocket_ad_id: payload.blocket_ad_id,
      bytbil_ad_id: payload.bytbil_ad_id,
      state: payload.state,
      logs: payload.logs
    });

    res.status(201).json({ success: true, data: createdAd });
  } catch (err) {
    console.error("CreateAd Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to create ad" });
  }
};
const getAdStatus = async (req, res) => {
  try {
    const { source_id } = req.params;
    const response = await blocketApi.getAdStatus(source_id);
    res.json({ success: true, data: response.data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to get ad status" });
  }
};
const updateAd = async (req, res) => {
  try {
    const { source_id } = req.params;
    const adData = req.body;

    const response = await blocketApi.updateAd(source_id, adData);
    res.json({ success: true, data: response.data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update ad" });
  }
};
const deleteAd = async (req, res) => {
  try {
    const { source_id } = req.params;

    await blocketApi.deleteAd(source_id);
    await Ads.destroy({ where: { source_id } });

    res.json({ success: true, message: "Ad deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete ad" });
  }
};
const bumpAd = async (req, res) => {
  try {
    const { source_id } = req.params;
    const response = await blocketApi.bumpAd(source_id);
    res.json({ success: true, data: response.data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to bump ad" });
  }
};



module.exports = {
    createAd,
    getAdStatus,
    updateAd,
    deleteAd,
    bumpAd
}