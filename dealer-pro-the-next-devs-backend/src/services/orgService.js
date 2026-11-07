const axios = require('axios');
const { getValitiveToken } = require('./valitiveAuthService');

const getOrgFromAPI = async (legalId) => {
  try {
    const token = await getValitiveToken();
    const response = await axios.put(
      `${process.env.VALITIVE_API_BASE_URL}/search/request`,
      {
        filter: {
          _type: "SPLIT",
          partyType: "ORG",
          country: "SE",
          legalId
        },
        dataClasses: [
          "O1_0_BASIC", "O1_1_GENERAL", "O2_0_STATUS", "O2_1_BOARD", 
          "O2_2_CONTACT", "O3_0_PHONE", "O4_0_LEGAL", "O5_0_FINANCE_BASIC", 
          "O5_1_FINANCE_GENERAL"
        ],
        frame: { startIndex: 0, count: 1 }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    // console.log("🌐 Valitive API Response:", JSON.stringify(response.data, null, 2));

console.log("🔍 Sending to Valitive:", JSON.stringify({
  legalId,
  country: "SE"
}, null, 2));



    const results = response.data?.results;
    if (!Array.isArray(results) || results.length === 0) {
      console.warn(`No results found for legalId = '${legalId}'`);
      return null;
    }

    // return results[0];
    return results[0]?.data || results[0]; 
  } catch (error) {
    console.error('Error fetching organization data:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { getOrgFromAPI };
