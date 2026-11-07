const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SENDER_SMTP_HOST,
  port: parseInt(process.env.MAIL_SENDER_SMTP_PORT),
  secure: process.env.MAIL_SENDER_SMTP_SECURE === 'true', // true = 465
  auth: {
    user: process.env.MAIL_SENDER_SMTP_USER,
    pass: process.env.MAIL_SENDER_SMTP_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
  from: `"DealerPro AB" <support@dealerpro.se>`,  // 👈 yahan apna domain email use karo
  replyTo: process.env.MAIL_SENDER_SMTP_USER,      // 👈 yeh rakh do takay replies MailerSend user par jaye
  to,
  subject,
  html,
});
    console.log("✅ Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
