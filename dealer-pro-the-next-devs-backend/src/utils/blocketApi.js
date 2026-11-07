// helperFunctions/blocketApi.js
const axios = require("axios");

const api = axios.create({
  baseURL: "https://api.blocket.se/pro-import-api/v3",
  headers: {
    "X-Auth-Token": process.env.BLOCKET_TOKEN,
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

module.exports = {
  createAd: (data) => api.post("/ad", data),
  getAdStatus: (source_id) => api.get(`/ad/${source_id}`),
  updateAd: (source_id, data) => api.put(`/ad/${source_id}`, data),
  deleteAd: (source_id) => api.delete(`/ad/${source_id}`),
  bumpAd: (source_id) => api.get(`/ad/${source_id}/bump`)
};
