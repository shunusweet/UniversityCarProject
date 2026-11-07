const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

// Create transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SENDER_SMTP_HOST,
  port: parseInt(process.env.MAIL_SENDER_SMTP_PORT),
  secure: process.env.MAIL_SENDER_SMTP_SECURE === 'true',
  auth: {
    user: process.env.MAIL_SENDER_SMTP_USER,
    pass: process.env.MAIL_SENDER_SMTP_PASS,
  },
});

// console.log("🛠 SMTP config", {
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   user: process.env.SMTP_USER,
//   pass: process.env.SMTP_PASS
// });
// Function to render EJS template
const renderTemplate = async (templateName, data) => {
    const templatePath = path.join(__dirname, '../templates/email', `${templateName}.ejs`);
console.log("🧪 Resolved email template path:", templatePath);

    return await ejs.renderFile(templatePath, data);
};

// Main send email function
const sendEmail = async (to, subject, templateName, data) => {
    try {
        // Render the email template
        const html = await renderTemplate(templateName, data);

        // Email options
      const mailOptions = {
  from: process.env.MAIL_SENDER_SMTP_USER,
  to,
  subject,
  html
};


        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendEmail }; 