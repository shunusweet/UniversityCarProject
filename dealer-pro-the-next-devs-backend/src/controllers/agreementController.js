const db = require("../models");
const asyncHandler = require("express-async-handler");
const Agreement = db.Agreement;
const axios = require("axios");
const { getValitiveToken } = require("../services/valitiveAuthService");
const autoNullify = require("../services/autoNullify");
const vehicle = require("../models/vehicle");
const User = db.User;
const Receipt = db.Receipt;

const getAllAgreements = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id); // ✅ Add await
    // console.log("User ID:",user); // Debugging line to check user ID
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const agreements = await Agreement.findAll({
      where: { corp_Id: user.corpId }, // ✅ Use correct field name
      attributes: {
        exclude: ['vehicleBrand'] // Temporarily exclude this column until migration is run
      },
      order: [
        ["createdAt", "ASC"],
        ["id", "DESC"]
      ],
    });

    if (!agreements || agreements.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No agreements found for this user",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Agreements fetched successfully",
      data: agreements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching agreements",
      error: error.message,
    });
  }
});
const createAgreement = asyncHandler(async (req, res) => {
  try {
    const {
      registrationNumber,
      purchaseDate,
      email,
      phone,
      purchasePrice,
      paymentMethod,
      vatType,
      creditMarking,
      mileage,
      latestService,
      numberOfKeys,
      deck,
      notes,
      creditor,
      depositor,
      creditAmount,
      name,
      customerType,
      address,
      birthDate,
      gender,
      salesDate,
      commissionRate,
      commissionAmount,
      agencyFee,
      insurer,
      insurerType,
      warrantyProvider,
      warrantyProduct,
      socialSecurityNumber,
      organizationNumber,
      tradeInType,
      tradeInRegistrationNumber,
      tradeInPurchaseDate,
      tradeInPurchasePrice,
      tradeInMileage,
      tradeInCreditMaking,
      type,
      vehicleModel,
      // Removing vehicleBrand from destructuring
      chassisNumber,
      color,
      vehicleYear,
      fuelType,
      gearbox,
      salesPriceSEK,
      tires,
      insuranceType,
      freeTextMessage,
      status,
      directimport,
      deliveryDate,
      deliveryLocation,
      deliveryTerms,
      latestServiceDate,
      pep,
      verification,
      tradeInRestAmount,
      accountNumber,
      bank,
      settlementDate,
      payoutDate,
      paymentDate,
      financialCompany,
      creditAmountSales,
      cashStack,
      loanPeriod,
    } = req.body;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: user info missing" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 🔍 Check for existing registrationNumber for this user
    if (registrationNumber) {
      const existing = await Agreement.findOne({
        where: {
          registrationNumber,
          userId: req.user.id,
        },
      });

      if (existing) {
        console.log('Found existing agreement:', {
          existingId: existing.id,
          registrationNumber: existing.registrationNumber,
          userId: existing.userId
        });
        return res
          .status(409)
          .json({
            success: false,
            message: `An agreement with registration number '${registrationNumber}' already exists`,
            existingAgreementId: existing.id
          });
      }
    }

    
// Create a new object without the vehicleBrand field
const agreementData = {
  registrationNumber,
  corp_Id: user.corpId,
  userId: req.user.id,
  purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
  email,
  phone,
  purchasePrice,
  paymentMethod,
  vatType,
  creditMarking,
  mileage: mileage ? parseInt(mileage.toString().replace(/[^0-9]/g, '')) || null : null,
  latestService,
  numberOfKeys: numberOfKeys ? parseInt(numberOfKeys) || null : null,
  deck,
  notes,
  creditor,
  depositor,
  creditAmount,
  name,
  customerType,
  address,
  birthDate,
  gender,
  salesDate,
  commissionRate,
  commissionAmount,
  agencyFee,
  insurer,
  insurerType,
  warrantyProvider,
  warrantyProduct,
  socialSecurityNumber,
  organizationNumber,
  tradeInType,
  tradeInRegistrationNumber,
  tradeInPurchaseDate,
  tradeInPurchasePrice,
  tradeInMileage,
  tradeInCreditMaking,
  type,
  vehicleModel,
  chassisNumber,
  color,
  vehicleYear,
  fuelType,
  gearbox,
  salesPriceSEK,
  tires,
  insuranceType,
  freeTextMessage,
  status,
  directimport,
  deliveryDate,
  deliveryLocation,
  deliveryTerms,
  latestServiceDate,
  pep,
  verification,
  tradeInRestAmount,
  accountNumber,
  bank,
  settlementDate: settlementDate ? new Date(settlementDate) : null,
  payoutDate: payoutDate ? new Date(payoutDate) : null,
  paymentDate: paymentDate ? new Date(paymentDate) : null,
  financialCompany,
  creditAmountSales,
  cashStack,
  loanPeriod,
};

// Remove any undefined properties
Object.keys(agreementData).forEach(key => {
  if (agreementData[key] === undefined) {
    delete agreementData[key];
  }
});

const agreement = await Agreement.create(agreementData);
console.log(")______________________________________");
console.log("Agreement created:", agreement);
console.log(")______________________________________");

const Customer =db.customer
// const { Customer } = require("../models");

await Customer.findOrCreate({
  where: { email }, // ya phir socialSecurityNumber ya phone ko unique key bana sakte ho
  defaults: {
    customerId: require("uuid").v4(),
    corpId: user.corpId,
    userId: req.user.id,
    name,
    telephone: phone,
    email,
    address,
    type:"Agreement",
    status: "Active",
    numberOfOrders: 1,
    //feroz
    postalCode: req.body.postalCode || "N/A",
    totalSpent: purchasePrice || 0,
    latestPurchase: new Date(),
    agreementType: type || "N/A",
    socialSecurityNumber: socialSecurityNumber || "N/A"
  }
}).then(async ([customer, created]) => {
  if (!created) {
    // agar existing customer mila to update kar do
    customer.numberOfOrders += 1;
    customer.totalSpent += purchasePrice || 0;
    customer.latestPurchase = new Date();
    await customer.save();
  }
});
console.log("Customer created or updated:", Customer);

    // ✅ Create Receipt
    const cleanAmount = purchasePrice
      ? parseFloat(purchasePrice.toString().replace(/[^0-9.]/g, ""))
      : 0;

    const receipt = await Receipt.create({
      agreementID: agreement.id,
      corp_Id: user.corpId,
      amount: cleanAmount,
      date: new Date(),
      receiptID: `RCPT-${Date.now()}`,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Agreement and receipt created successfully",
      data: {
        agreement,
        receipt,
      },
    });
  } catch (error) {
    console.error("Create Agreement Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create agreement",
      error: error.message,
    });
  }
});
const getAgreementById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const agreement = await Agreement.findOne({
      where: {
        id: req.params.id,
        corp_Id: user.corpId, // ✅ Ensure user can only access their own corp’s agreement
      },
    });

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: "Agreement not found",
      });
    }

    res.status(200).json({ success: true, data: agreement });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching agreement",
      error: error.message,
    });
  }
});
const updateAgreement = asyncHandler(async (req, res) => {
  try {
    const agreement = await Agreement.findByPk(req.params.id);
    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: "Agreement not found",
      });
    }

    const {
      registrationNumber,
      purchaseDate,
      email,
      phone,
      purchasePrice,
      paymentMethod,
      vatType,
      creditMarking,
      mileage,
      latestService,
      numberOfKeys,
      deck,
      notes,
      creditor,
      depositor,
      creditAmount,
      name,
      customerType,
      address,
      birthDate,
      gender,
      salesDate,
      commissionRate,
      commissionAmount,
      agencyFee,
      insurer,
      insurerType,
      warrantyProvider,
      warrantyProduct,
      socialSecurityNumber,
      organizationNumber,
      tradeInType,
      tradeInRegistrationNumber,
      tradeInPurchaseDate,
      tradeInPurchasePrice,
      tradeInMileage,
      tradeInCreditMaking,
      type,
      directimport,
      deliveryDate,
      deliveryLocation,
      deliveryTerms,
      latestServiceDate,
      pep,
      verification,
      tradeInRestAmount,
      accountNumber,
      bank,
      settlementDate,
      payoutDate,
      paymentDate,
    } = req.body;

    await agreement.update({
      registrationNumber,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
      email,
      phone,
      purchasePrice,
      paymentMethod,
      vatType,
      creditMarking,
      mileage,
      latestService,
      numberOfKeys,
      deck,
      notes,
      creditor,
      depositor,
      creditAmount,
      name,
      customerType,
      address,
      birthDate,
      gender,
      salesDate,
      commissionRate,
      commissionAmount,
      agencyFee,
      insurer,
      insurerType,
      warrantyProvider,
      warrantyProduct,
      socialSecurityNumber,
      organizationNumber,
      tradeInType,
      tradeInRegistrationNumber,
      tradeInPurchaseDate,
      tradeInPurchasePrice,
      tradeInMileage,
      tradeInCreditMaking,
      type,
      directimport,
      deliveryDate,
      deliveryLocation,
      deliveryTerms,
      latestServiceDate,
      pep,
      verification,
      tradeInRestAmount,
      accountNumber,
      bank,
      settlementDate: settlementDate ? new Date(settlementDate) : null,
      payoutDate: payoutDate ? new Date(payoutDate) : null,
      paymentDate: paymentDate ? new Date(paymentDate) : null,
    });

    res.status(200).json({
      success: true,
      message: "Agreement updated successfully",
      data: agreement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating agreement",
      error: error.message,
    });
  }
});
const deleteAgreement = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const agreement = await Agreement.findOne({
      where: {
        id: req.params.id,
        corp_Id: user.corpId, // ✅ Only delete if belongs to user’s corp
      },
    });

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: "Agreement not found",
      });
    }

    await agreement.destroy();

    res.status(200).json({
      success: true,
      message: "Agreement deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting agreement",
      error: error.message,
    });
  }
});
const countAgreements = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const count = await Agreement.count({
      where: {
        corp_Id: user.corpId, // ✅ Filter agreements by user's corp only
      },
    });

    res.status(200).json({
      success: true,
      totalAgreements: count,
      message:
        count === 0
          ? "No agreements found"
          : "Agreement count fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error counting agreements",
      error: error.message,
    });
  }
});
const fetchValitiveOrgInfo = asyncHandler(async (req, res) => {
  try {
    const token = await getValitiveToken();
    const { orgId = "", country = "SE" } = req.body;

    if (!orgId) {
      return res
        .status(400)
        .json({ success: false, message: "orgId is required" });
    }

    const url = `${process.env.VALITIVE_API_BASE_URL}/search/request`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const payload = {
      filter: {
        _type: "SIMPLE",
        partyType: "ORG",
        country,
        what: orgId,
      },
      dataClasses: ["O1_0_BASIC", "O1_1_GENERAL", "O2_0_STATUS"],
      clientTag: "org-info",
      frame: { startIndex: 0, count: 1 },
    };

    console.log("➡️ Payload sent:", payload);

    const response = await axios.put(url, payload, { headers });
    // Log the entire response body for inspection:
    console.log("📦 Valitive Response:", response.data);

    // Assuming the API returns an object with orgId and country
    const { orgId: id, country: ctry, ...rest } = response.data;

    return res.status(200).json({
      success: true,
      data: {
        orgId: id,
        country: ctry,
        ...rest,
      },
    });
  } catch (error) {
    console.error(
      "❌ Org Info Fetch Error:",
      error.response?.data || error.message
    );
    return res.status(error.response?.status || 500).json({
      success: false,
      message: "Failed to fetch organization info from Valitive",
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

const fetchValitiveAgreements = asyncHandler(async (req, res) => {
  try {
    const token = await getValitiveToken();
    const { type = "PERSON", query = "" } = req.body;

    // Capitalize query if type is VEHICLE
    const searchQuery = type === "VEHICLE" ? query.toUpperCase() : query;

    const url = `${process.env.VALITIVE_API_BASE_URL}/search/request`;

    if (!searchQuery || searchQuery.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid search query (min 3 characters)",
      });
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    let filter, dataClasses;

    if (type === "PERSON") {
      filter = {
        _type: "SIMPLE",
        partyType: "PERSON",
        country: "SE",
        what: searchQuery,
      };
      dataClasses = [
        "P1_0_BASIC",
        "P1_1_GENERAL",
        "P1_2_EXTENDED",
        "P1_3_SE_REG",
        // "P3_0_PHONE_BASIC"
      ];
    } else if (type === "ORG") {
      filter = {
        _type: "SPLIT",
        partyType: "ORG",
        country: "SE",
        legalId: searchQuery,
      };
      dataClasses = [
        "O1_0_BASIC",
        "O1_1_GENERAL",
        "O2_0_STATUS",
        "O2_1_BOARD",
        "O2_2_CONTACT",
        "O3_0_PHONE",
        "O4_0_LEGAL",
        "O5_0_FINANCE_BASIC",
        "O5_1_FINANCE_GENERAL",
      ];
    } else if (type === "VEHICLE") {
      filter = {
        _type: "SIMPLE",
        partyType: "VEHICLE",
        country: "SE",
        what: searchQuery,
      };
      dataClasses = [
        "V1_0_BASIC",
        "V1_1_GENERAL",
        "V2_0_OWNER_BASIC",
        "V2_1_OWNER_GENERAL",
        "V3_0_STATUS",
        "V4_0_ORIGIN",
        "V5_0_TECH_SPEC_BASIC",
        "V6_0_ENVIRONMENTAL",
      ];
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid type specified. Use PERSON, ORG, or VEHICLE.",
      });
    }

    const payload = {
      filter,
      dataClasses,
      clientTag: "myClient",
      frame: { startIndex: 0, count: 1 },
    };

    const response = await axios.put(url, payload, { headers });
    const results = response.data?.results || [];

    return res.status(200).json({
      success: true,
      type,
      keyword: searchQuery,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error(
      "❌ Valitive API Error:",
      error.response?.data || error.message
    );
    return res.status(error.response?.status || 500).json({
      success: false,
      message: "Failed to fetch data from Valitive",
      error: error.message,
      details: error.response?.data || null,
    });
  }
});
module.exports = {
  createAgreement,
  getAllAgreements,
  getAgreementById,
  updateAgreement,
  deleteAgreement,
  countAgreements,
  fetchValitiveAgreements,
  fetchValitiveOrgInfo,
};