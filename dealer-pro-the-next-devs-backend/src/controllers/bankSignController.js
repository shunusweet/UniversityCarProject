const db = require("../models/index.js");
const jwt = require("jsonwebtoken");

const User = db.User;

const Agreement = db.Agreement;
const SignedAgreement = db.SignedAgreement;
const axios = require("axios");
const {
  startSignOrAuth,
  collectStatus,
} = require("../services/bankSignService");

//  Start BankID Signing
const startBankSign = async (req, res) => {
  try {
    const {
      agreementID,
      userVisibleData,
      userNonVisibleData,
      accessToken,
      publicAccess,
    } = req.body;

    const endUserIp =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip;
    console.log(endUserIp);

    if (!agreementID) {
      return res.status(400).json({ error: "Missing agreementID" });
    }

    // Check if agreement exists
    const agreement = await Agreement.findByPk(agreementID);
    if (!agreement) {
      return res.status(404).json({ error: "Agreement not found" });
    }

    let user = null;
    let corpId = null;

    // Handle public access vs authenticated access
    if (publicAccess && accessToken) {
      // Validate public access token
      try {
        const decoded = jwt.verify(
          accessToken,
          process.env.JWT_SECRET || "your-secret-key"
        );

        // Check if token is for this agreement
        if (decoded.agreementId !== parseInt(agreementID)) {
          return res
            .status(401)
            .json({ error: "Token not valid for this agreement" });
        }

        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.expires < currentTime) {
          return res.status(401).json({ error: "Signing link has expired" });
        }

        console.log("Public access signing for agreement:", agreementID);
      } catch (jwtError) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
    } else {
      // Regular authenticated access
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      user = await User.findByPk(req.user.id);
      corpId = user.corpId;
      console.log("Authenticated signing by user:", req.user.id);
    }

    // Start BankID sign process
    const result = await startSignOrAuth({
      endUserIp,
      userVisibleData,
      userNonVisibleData,
    });

    if (!result || !result.orderRef) {
      return res.status(500).json({ error: "BankSign failed to start" });
    }

    // Save to SignedAgreement
    const signedAgreement = await SignedAgreement.create({
      agreementID,
      orderRef: result.orderRef,
      stats: "pending",
      corp_Id: corpId,
      isPublicAccess: publicAccess || false,
      accessToken: publicAccess ? accessToken : null,
    });

    res.status(200).json({
      success: true,
      message: "BankID sign started and saved",
      signedAgreement,
      bankIdResponse: result,
    });
  } catch (err) {
    console.error("❌ Controller Error [startBankSign]:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
//  Send SMS with BankID Link
const sendBankIdLinkSMS = async (req, res) => {
  
  try {
    const { phone, link, accessToken, publicAccess } = req.body;

    if (!phone || !link) {
      return res.status(400).json({ error: "Missing phone or link" });
    }

    let sender = "DealerPro"; // Default sender
    let user = null;

   
    if (publicAccess && accessToken) {
      
      try {
        jwt.verify(accessToken, process.env.JWT_SECRET || "your-secret-key");
        sender = "DealerPro"; // Use default or decode from token
      } catch (jwtError) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
    } else {
      // Regular authenticated access
      user = req.user;
      if (!user || !user.corpName) {
        return res
          .status(403)
          .json({ error: "User not authenticated or corpName missing" });
      }
      sender = user.corpName;
    }

    const token = process.env.PIXIE_API_TOKEN;

    const message = `Hej!
Ditt avtal är nu klart att läsas och signeras. Klicka på länken nedan för att ta del av det:
${link}
Har du några frågor är du varmt välkommen att höra av dig.
/ ${sender}`;

    const response = await axios.post(
      "https://app.pixie.se/api/v2/sms",
      {
        sender,
        message,
        recipients: [phone],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json({ success: true, sms: response.data });
  } catch (err) {
    console.error("❌ SMS Send Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to send SMS" });
  }
};

const checkBankSignStatus = async (req, res) => {
  try {
    const { orderRef } = req.body;

    if (!orderRef) {
      return res.status(400).json({ error: "Missing orderRef" });
    }

    const status = await collectStatus(orderRef);

    if (!status) {
      return res
        .status(404)
        .json({ error: "No status found or failed to fetch" });
    }

    console.log("Raw BankID Status Response:", JSON.stringify(status, null, 2));

    // Get the actual status from the response
    const bankIdStatus = status.Response?.Status;
    const statusMessage =
      status.Response?.StatusMessage || status.StatusMessage || "unknown";

    // Map BankID statuses to our internal statuses
    let newStats;
    switch (bankIdStatus) {
      case "complete":
        newStats = "approved";
        break;
      case "failed":
      case "cancelled":
        newStats = "failed";
        break;
      case "pending":
      case "outstanding":
      case "started":
      default:
        newStats = "pending";
        break;
    }

    console.log(`BankID Status: ${bankIdStatus}, Mapped to: ${newStats}`);

    // Update SignedAgreement table
    const [affectedRows] = await SignedAgreement.update(
      { stats: newStats },
      { where: { orderRef } }
    );

    console.log(`Updated ${affectedRows} row(s) to stats='${newStats}'`);

    return res.status(200).json({
      success: newStats === "approved",
      updatedStatus: newStats,
      affectedRows,
      bankIdStatus: status,
    });
  } catch (err) {
    console.error("❌ Controller Error [checkBankSignStatus]:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllAgreementsStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user || !user.corpId) {
      return res
        .status(400)
        .json({ error: "`corpId` is required to fetch agreements" });
    }

    // Fetch all signed agreements for the corp
    const agreements = await SignedAgreement.findAll({
      where: { corp_Id: user.corpId },
      order: [["createdAt", "DESC"]],
    });

    // Group by stats and count pending
    let pendingCount = 0;

    const grouped = agreements.reduce((acc, agreement) => {
      const status = agreement.stats || "unknown";

      if (status === "pending") {
        pendingCount++;
      }

      if (!acc[status]) acc[status] = [];
      acc[status].push(agreement);
      return acc;
    }, {});

    return res.status(200).json({
      grouped,
      pendingCount,
    });
  } catch (err) {
    console.error("Error fetching agreements:", err);
    return res
      .status(500)
      .json({ error: "Internal server error. Unable to fetch agreements." });
  }
};

module.exports = {
  startBankSign,
  checkBankSignStatus,
  sendBankIdLinkSMS,
  getAllAgreementsStatus,
};