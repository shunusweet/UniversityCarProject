

const db = require('../models');


const PdfData = db.PdfData;
const Agreement = db.Agreement;
const asyncHandler = require('express-async-handler');
const User = db.User;


const uploadPdfData = asyncHandler(async (req, res) => {
  const { agreementId } = req.body;

  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const agreement = await Agreement.findByPk(agreementId);
  if (!agreement) {
    return res.status(404).json({ success: false, message: 'Agreement not found.' });
  }

  const existingPDF = await PdfData.findOne({
    where: {
      agreementId,
      corp_Id: user.corpId
    }
  });

  if (existingPDF) {
    return res.status(400).json({
      success: false,
      message: 'PDF already exists for this agreement.'
    });
  }

  const pdfRecord = await PdfData.create({
    agreementId,
    corp_Id: user.corpId,
    pdf: req.file.filename
  });

  // ✅ Generate download link
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const pdfUrl = `${baseUrl}/uploads/pdfs/${req.file.filename}`;

  res.status(201).json({
    success: true,
    message: 'File uploaded & saved successfully',
    data: {
      id: pdfRecord.id,
      agreementId: pdfRecord.agreementId,
      corp_Id: pdfRecord.corp_Id,
      filename: pdfRecord.pdf,
      pdfUrl: pdfUrl // ✅ Link to download/view the file
    }
  });
});

module.exports={
  uploadPdfData
};
