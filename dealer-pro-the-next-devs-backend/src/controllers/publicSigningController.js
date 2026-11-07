// agreementController.js - Add these methods to your existing controller
const db = require("../models/index.js");
const Agreement = db.Agreement;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../utils/emailHelper.js"); // Adjust path as needed
const emailjs = require('@emailjs/nodejs');
const publicSigningSessions = db.publicsigningsessions; // use exact model name

const generatePublicSigningToken = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { expiryHours = 1, emailSent = null, smsSent = null } = req.body;

    // Check if agreement exists
    const agreement = await Agreement.findByPk(agreementId);
    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: "Agreement not found",
      });
    }

    // Token payload
    const tokenData = {
      agreementId: parseInt(agreementId),
      expires: Math.floor(Date.now() / 1000) + expiryHours * 3600,
      random: crypto.randomBytes(16).toString("hex"),
      type: "public-signing",
    };

    const accessToken = jwt.sign(
      tokenData,
      process.env.JWT_SECRET || "your-secret-key"
    );

    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("tokenData:", tokenData);

    const expiryTimestamp = new Date(tokenData.expires * 1000);
    const frontendUrl = process.env.FRONTEND_URL || "https://dealer.clubpadel.se";
    const publicLink = `${frontendUrl}/agreement-sign/${agreementId}?token=${accessToken}&expires=${tokenData.expires}`;

    // Insert into DB matching table schema
    await publicSigningSessions.create({
      agreementId: agreementId,
      accessToken,
      expiryTimestamp,
      emailSent,
      smsSent,
      isUsed: false,
      usedAt: null
    });

    res.json({
      success: true,
      data: {
        accessToken,
        publicLink,
        expiryTimestamp,
        expiresIn: expiryHours * 3600,
      },
    });
  } catch (error) {
    console.error("Error generating public signing token:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate public signing token",
    });
  }
};

//commentcode

const getAgreementByIdPublic = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    // 1️⃣ Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 2️⃣ Check if token matches the given agreementId
    if (decoded.agreementId !== parseInt(agreementId)) {
      return res.status(401).json({
        success: false,
        message: "Token not valid for this agreement",
      });
    }

    // 3️⃣ Check expiry time
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.expires < currentTime) {
      return res.status(401).json({
        success: false,
        message: "Signing link has expired",
      });
    }

    // 4️⃣ Verify token exists in DB & not used
    const signingSession = await publicSigningSessions.findOne({
      where: {
        agreementId,
        accessToken: token
      }
    });

    if (!signingSession) {
      return res.status(401).json({
        success: false,
        message: "No valid signing session found for this token",
      });
    }

    if (signingSession.isUsed) {
      return res.status(401).json({
        success: false,
        message: "This signing link has already been used",
      });
    }

    if (signingSession.expiryTimestamp && new Date(signingSession.expiryTimestamp) < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Signing link has expired (DB expiry)",
      });
    }

    // 5️⃣ Get agreement data (with any associations)
    const agreement = await Agreement.findByPk(agreementId, {
      // include: [...] // add relations if needed
    });

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: "Agreement not found",
      });
    }

    // 6️⃣ Return response
    res.json({
      success: true,
      data: agreement,
      publicAccess: true,
      tokenExpires: decoded.expires
    });

  } catch (error) {
    console.error("Error fetching agreement for public access:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch agreement data",
    });
  }
};


// const sendPublicSigningLinkEmail = async (req, res) => {
//   try {
//     const { agreementId } = req.params;
//     const { email, expiryHours = 1 } = req.body;

//     // Generate the token
//     const tokenResult = await generatePublicSigningTokenInternal(
//       agreementId,
//       expiryHours
//     );

//     if (!tokenResult.success) {
//       return res.status(400).json(tokenResult);
//     }

//     // Send email with the link
//     // Replace this with your actual email service
//     const emailResult = await sendEmail({
//       to: email,
//       subject: "Agreement Signing Link",
//       html: `
//         <h2>Agreement Signing</h2>
//         <p>You have been invited to sign an agreement. Please click the link below:</p>
//         <p><a href="${tokenResult.data.publicLink}">Sign Agreement</a></p>
//         <p>This link will expire on ${new Date(
//           tokenResult.data.expiryTimestamp * 1000
//         ).toLocaleString()}</p>
//         <p>If you cannot click the link, copy and paste this URL into your browser:</p>
//         <p>${tokenResult.data.publicLink}</p>
//       `,
//     });

//     res.json({
//       success: true,
//       message: "Signing link sent successfully",
//       data: {
//         email: email,
//         linkExpires: tokenResult.data.expiryTimestamp,
//       },
//     });
//   } catch (error) {
//     console.error("Error sending public signing link:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to send signing link",
//     });
//   }
// };



// const sendPublicSigningLinkEmail = async (req, res) => {
//   try {
//     const { agreementId } = req.params;
//     const { email, expiryHours = 1 } = req.body;

//     // Generate the token
//     const tokenResult = await generatePublicSigningTokenInternal(
//       agreementId,
//       expiryHours
//     );

//     if (!tokenResult.success) {
//       return res.status(400).json(tokenResult);
//     }

//     // Prepare email params
//     const templateParams = {
//       to_email: email,
//       agreement_link: tokenResult.data.publicLink,
//       expiry_date: new Date(tokenResult.data.expiryTimestamp * 1000).toLocaleString(),
//     };

//     // Send email with EmailJS
//     const result = await emailjs.send(
//       process.env.EMAILJS_SERVICE_ID,   
//       process.env.EMAILJS_TEMPLATE_ID, 
//       templateParams,
//       {
//         publicKey: process.env.EMAILJS_PUBLIC_KEY, 
//         privateKey: process.env.EMAILJS_PRIVATE_KEY, 
//       }
//     );

//     res.json({
//       success: true,
//       message: "Signing link email sent successfully",
//       data: {
//         email,
//         linkExpires: tokenResult.data.expiryTimestamp,
//         result,
//       },
//     });
//   } catch (error) {
//     console.error("Error sending EmailJS signing link:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to send email",
//     });
//   }
// };

//  old code 
const sendPublicSigningLinkSMS = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { phone, expiryHours = 1 } = req.body;

    // Generate the token
    const tokenResult = await generatePublicSigningTokenInternal(
      agreementId,
      expiryHours
    );

    if (!tokenResult.success) {
      return res.status(400).json(tokenResult);
    }

    // Send SMS with the link
    // Replace this with your actual SMS service
    const smsResult = await sendSMS({
      to: phone,
      message: `You have been invited to sign an agreement. Link: ${
        tokenResult.data.publicLink
      } (Expires: ${new Date(
        tokenResult.data.expiryTimestamp * 1000
      ).toLocaleDateString()})`,
    });

    res.json({
      success: true,
      message: "Signing link sent successfully",
      data: {
        phone: phone,
        linkExpires: tokenResult.data.expiryTimestamp,
      },
    });
  } catch (error) {
    console.error("Error sending SMS signing link:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send SMS",
    });
  }
};

const generatePublicSigningTokenInternal = async (agreementId, expiryHours) => {
  try {
    // Check if agreement exists
    const agreement = await Agreement.findByPk(agreementId);
    if (!agreement) {
      return {
        success: false,
        message: "Agreement not found",
      };
    }

    // Create token data
    const tokenData = {
      agreementId: parseInt(agreementId),
      expires: Math.floor(Date.now() / 1000) + expiryHours * 3600,
      random: crypto.randomBytes(16).toString("hex"),
      type: "public-signing",
    };

    // Sign the token
    const accessToken = jwt.sign(
      tokenData,
      process.env.JWT_SECRET || "your-secret-key"
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const publicLink = `${frontendUrl}/agreement-sign/${agreementId}?token=${accessToken}&expires=${tokenData.expires}`;

    return {
      success: true,
      data: {
        accessToken,
        publicLink,
        expiryTimestamp: tokenData.expires,
      },
    };
  } catch (error) {
    console.error("Error generating token internally:", error);
    return {
      success: false,
      message: "Failed to generate token",
    };
  }
};



const sendPublicSigningLinkEmail = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { email, expiryHours = 1 } = req.body;

    // 1️⃣ Generate the token
    const tokenResult = await generatePublicSigningTokenInternal(
      agreementId,
      expiryHours
    );

    if (!tokenResult.success) {
      return res.status(400).json(tokenResult);
    }

    // 2️⃣ Email subject + body
    const subject = "Signing Link - DealerPro";
    const html = `
      <h2>Agreement Signing Link</h2>
      <p>Please use the following link to sign your agreement:</p>
      <p><a href="${tokenResult.data.publicLink}" target="_blank">Sign Agreement</a></p>
      <p><b>Expiry:</b> ${new Date(
        tokenResult.data.expiryTimestamp * 1000
      ).toLocaleString()}</p>
      <br/>
      <p>Regards,<br/>DealerPro Team</p>
    `;

    // 3️⃣ Send email via existing helper
    const result = await sendEmail(email, subject, html);

    if (!result.success) {
      return res.status(500).json({ success: false, message: result.error });
    }

    res.json({
      success: true,
      message: "Signing link email sent successfully via DealerPro SMTP",
      data: {
        email,
        linkExpires: tokenResult.data.expiryTimestamp,
        messageId: result.messageId,
      },
    });
  } catch (error) {
    console.error("❌ Error sending signing link via DealerPro SMTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
};



const sendSMS = async ({ to, message }) => {
  // Implement your SMS sending logic here
  // Examples: twilio, aws sns, etc.
  console.log(`Sending SMS to ${to}: ${message}`);
  return { success: true };
};


const sendTestEmail = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    const html = `<p>${message}</p>`; // simple body

    const result = await sendEmail(to, subject, html);

    if (!result.success) {
      return res.status(500).json({ success: false, message: result.error });
    }

    res.json({
      success: true,
      message: "Email sent successfully",
      messageId: result.messageId,
    });
  } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



module.exports = {

  generatePublicSigningToken,
  getAgreementByIdPublic,
  sendPublicSigningLinkEmail,
  sendPublicSigningLinkSMS,
  sendTestEmail
};
