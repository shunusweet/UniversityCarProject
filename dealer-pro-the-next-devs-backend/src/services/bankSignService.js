const axios = require('axios');

 
 
// Start Auth/Sign
const startSignOrAuth = async ({ endUserIp, userVisibleData, userNonVisibleData }) => {
  const requiredEnvVars = [
    'BANKSIGN_USER',
    'BANKSIGN_PASS',
    'COMPANY_API_GUID',
    'REDIRECT_URL',
    'BANK_ID_AUTH_API'
  ];
 
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  });
 
  try {
 
    const response = await axios.post(`${process.env.BANK_ID_AUTH_API}/sign`, {
      apiUser: process.env.BANKSIGN_USER,
      password: process.env.BANKSIGN_PASS,
      companyApiGuid: process.env.COMPANY_API_GUID,
      endUserIp,
      userVisibleData,
      userNonVisibleData,
      getQr: true
    });
 
    const { authResponse, apiCallResponse } = response.data;
 
    if (!authResponse?.Success) {
      console.warn("🔐 BankSign start error:", authResponse.ErrorMessage);
      return null;
    }
 
    const result = apiCallResponse.Response;
    console.log("✅ BankSign Start Response:", JSON.stringify(result, null, 2));
 
    return {
      orderRef: result.OrderRef,
      autoStartToken: result.AutoStartToken,
      qrImage: `${result.QrImage}?t=${Date.now()}`, // Prevent browser caching
      bankidUrl: `https://app.bankid.com/?autostarttoken=${result.AutoStartToken}&redirect=${process.env.REDIRECT_URL}`
    };
  } catch (error) {
    console.error("❌ Error in startSignOrAuth:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};
 
// Collect Status
const collectStatus = async (orderRef) => {
  const requiredEnvVars = [
    'BANKSIGN_USER',
    'BANKSIGN_PASS',
    'COMPANY_API_GUID',
    'BANK_ID_AUTH_API'
  ];
 
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  });
 
  try {
    const response = await axios.post(`${process.env.BANK_ID_AUTH_API}/collectstatus`, {
      apiUser: process.env.BANKSIGN_USER,
      password: process.env.BANKSIGN_PASS,
      companyApiGuid: process.env.COMPANY_API_GUID,
      orderRef: orderRef
    });
 
    const { authResponse, apiCallResponse } = response.data;
 
    if (authResponse.Success===false) {
      console.warn("📥 BankSign status error:", authResponse.ErrorMessage);
      return null;
    }
 
    console.log("📊 BankSign Status Response:", JSON.stringify(apiCallResponse, null, 2));
    return apiCallResponse;
  } catch (error) {
    console.error("❌ Error in collectStatus:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};
 
module.exports = {
  startSignOrAuth,
  collectStatus
};