const fs = require('fs');
const { MailerSend, EmailParams, Sender, Recipient, Attachment } = require('mailersend');
const {axios} =require("axios")

// import nodemailer from 'nodemailer';
const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');
// import asyncHandler from 'express-async-handler';

// const mailerSend = new MailerSend({ apiKey: process.env.MAIL_SENDER_API_KEY });
const mailerSend = new MailerSend({
  apiKey: process.env.MAIL_SENDER_API_KEY,
});
const sendEmailWithPdf = async (req, res) => {
  // Your existing controller code
  try {
    const { toEmail, subject, message,fromEmail,corpName } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'PDF file is required' });
    }

    const attachment = new Attachment(
      fs.readFileSync(file.path, { encoding: 'base64' }),
      file.originalname,
      'attachment'
    );

    const emailParams = new EmailParams()
      .setFrom(new Sender(fromEmail, corpName))
      .setTo([new Recipient(toEmail, toEmail)])
      .setSubject(subject)
      .setText(message)
      .setHtml(`<p>${message}</p>`)
      .setAttachments([attachment]);

    await mailerSend.email.send(emailParams);

    res.status(200).json({ success: true, message: 'Email sent with PDF attachment' });
  } catch (error) {
    console.error('Error sending email:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
};





const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SENDER_SMTP_HOST,
  port: Number(process.env.MAIL_SENDER_SMTP_PORT), // 587
  secure: false, // false for STARTTLS (port 587)
  auth: {
    user: process.env.MAIL_SENDER_SMTP_USER,
    pass: process.env.MAIL_SENDER_SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false // allow self-signed or unverified certs
  }
});


const sendEmailWithBankIDLink = async (req, res) => {
  const { phone, link, accessToken, publicAccess } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_SENDER_SMTP_HOST,
      port: parseInt(process.env.MAIL_SENDER_SMTP_PORT),
      secure: process.env.MAIL_SENDER_SMTP_SECURE === 'true', // convert string to boolean
      auth: {
        user: process.env.MAIL_SENDER_SMTP_USER,
        pass: process.env.MAIL_SENDER_SMTP_PASS
      }
    });

    let mailOptions = {
      from: process.env.MAIL_SENDER_SMTP_USER,
      to: phone, // yahan email hona chahiye, agar tum phone pe bhejna chahte ho to SMS API chahiye
      subject: 'BankID Signing Link',
      html: `<p>Click the link to sign: <a href="${link}">${link}</a></p>`
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: 'BankID link sent successfully'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to send email via SMTP',
      error: error.message
    });
  }
};


module.exports = { sendEmailWithPdf,sendEmailWithBankIDLink };