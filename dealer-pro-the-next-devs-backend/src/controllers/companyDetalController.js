const db = require('../models/index.js');
const asyncHandler = require('express-async-handler');
const CompanyDetails = db.CompanyDetails;
const User=db.User;
const {uploadFiles } = require('../services/uploadMedia.js');


const getByIdCompanyDetail =asyncHandler(async (req, res) => {
  try{
    const { id } = req.params;
     console.log('Fetching company details for ID:', id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Company ID is required.' });
    }
 
    const companyDetails = await CompanyDetails.findOne({
      where: { id  },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });
 
    if (!companyDetails) {
      return res.status(404).json({ success: false, message: 'Company details not found.' });
    }
 
    res.status(200).json({ success: true, data: companyDetails });
  }catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching company details',
      error: error.message
    });
 
 
  };
});
const updateUserByType = async ({ user, updates }) => {
  user.first = updates.contactPerson?.split(' ')[0] ?? user.first;
  user.last = updates.contactPerson?.split(' ')[1] ?? user.last;
  user.email = updates.emailAddress ?? user.email;
  user.phone = updates.phoneNumber ?? user.phone;

  // Optional: If you're saving roleTitle in the User table somewhere (currently not in model)
  user.roleTitle = updates.roleTitle ?? user.roleTitle;

  await user.save();
};
const updateCompanyDetails = asyncHandler(async (req, res) => {
  const { type } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    const company = await CompanyDetails.findOne({ where: { corp_Id: user.corpId } });

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    // Helper function for S3 file upload
    const handleFileUpload = async () => {
      if (req.file) {
        const mediaItem = {
          filename: req.file.originalname,
          type: req.file.mimetype,
          data: req.file.buffer,
        };
        const uploadedUrls = await uploadFiles([mediaItem]);
        if (uploadedUrls?.length > 0) {
          company.attachments = uploadedUrls[0];
        }
      }
    };

    if (type === 'Company Information') {
      company.company_name = req.body.company_name ?? company.company_name;
      company.registrationNumber = req.body.registrationNumber ?? company.registrationNumber;
      company.legalEntityType = req.body.legalEntityType ?? company.legalEntityType;
      company.dateOfRegistration = req.body.dateOfRegistration ?? company.dateOfRegistration;
      company.vatNumber = req.body.vatNumber ?? company.vatNumber;
      company.industry_code = req.body.industry_code ?? company.industry_code;
      company.company_mailaddress = req.body.company_mailaddress ?? company.company_mailaddress;
      company.company_phonenumber = req.body.company_phonenumber ?? company.company_phonenumber;
     if (Array.isArray(req.body.preferred_language)) {
    company.preferred_language = req.body.preferred_language.join(','); // comma separated string
  } else if (typeof req.body.preferred_language === 'string') {
    company.preferred_language = req.body.preferred_language;
  }
      company.business_description = req.body.business_description ?? company.business_description;
      await handleFileUpload();
    }

    else if (type === 'Contact Information') {
       // Update User
      const nameParts = req.body.first?.trim().split(' ') || [];
      user.first = nameParts[0] ?? user.first;
      user.last = nameParts[1] ?? user.last;
      user.email = req.body.emailAddress ?? user.email;
      user.phone = req.body.phoneNumber ?? user.phone;
      user.roleTitle = req.body.user ?? user.roleTitle;
      await user.save();
 
      // Update Company
      company.first = req.body.first ?? company.first;
      company.last = req.body.last ?? company.last;
      company.emailAddress = req.body.emailAddress ?? company.emailAddress;
      company.phoneNumber = req.body.phoneNumber ?? company.phoneNumber;
      company.roleTitle = req.body.user ?? company.roleTitle;
      company.mailingAddress = req.body.mailingAddress ?? company.mailingAddress;
      company.visitingAddress = req.body.visitingAddress ?? company.visitingAddress;
      company.company_mailaddress = req.body.company_mailaddress ?? company.company_mailaddress;
      company.company_phonenumber = req.body.company_phonenumber ?? company.company_phonenumber;
      await handleFileUpload();
    }

    else if (type === 'Address Details') {
      // company.visitingAddress = req.body.visitingAddress ?? company.visitingAddress;
      // company.mailingAddress = req.body.mailingAddress ?? company.mailingAddress;
      company.postalCode = req.body.postalCode ?? company.postalCode;
      company.city = req.body.city ?? company.city;
      company.country = req.body.country ?? company.country;
    }

    else if (type === 'Payment Settings') {
      company.bankAccountNumber = req.body.bankAccountNumber ?? company.bankAccountNumber;
      company.iban_Bic = req.body.iban_Bic ?? company.iban_Bic;
      company.swish_Number = req.body.swish_Number ?? company.swish_Number;
      company.payment_Terms = req.body.payment_Terms ?? company.payment_Terms;
      company.late_payment_interest_rate = 
              req.body.late_payment_interest_rate === "" 
                ? null 
                : req.body.late_payment_interest_rate ?? company.late_payment_interest_rate;

      company.invoice_Fee = req.body.invoice_Fee ?? company.invoice_Fee;
      company.bicSwift = req.body.bicSwift ?? company.bicSwift;
    }

    else if (type === 'Invoice Settings') {
      company.invoice_number_counter = req.body.invoice_number_counter ?? company.invoice_number_counter;
      company.currency = req.body.currency ?? company.currency;
      company.invoice_language = req.body.invoice_language ?? company.invoice_language;
      company.reference_person = req.body.reference_person ?? company.reference_person;
      company.invoice_number_prefix = req.body.invoice_number_prefix ?? company.invoice_number_prefix;
    }

    else if (type === 'Contract Settings') {
      company.default_invoice_message = req.body.default_invoice_message ?? company.default_invoice_message;
      company.contract_duration = req.body.contract_duration ?? company.contract_duration;
      company.signing_method = req.body.signing_method ?? company.signing_method;
      company.contract_version_control = req.body.contract_version_control ?? company.contract_version_control;
      company.contract_contact_person = req.body.contract_contact_person ?? company.contract_contact_person;
      company.contract_terms = req.body.contract_terms ?? company.contract_terms;
    }

    else {
      return res.status(400).json({ success: false, message: 'Invalid update type provided.' });
    }

    // Always save company after changes
    await company.save();

    return res.status(200).json({
      success: true,
      message: `${type} updated successfully.`,
      data: { user, company }
    });

  } catch (error) {
    console.error('Error updating company details:', error);
    return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
});

const getCompanyDetailByUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const companyDetails = await CompanyDetails.findOne({
      where: { corp_Id: user.corpId },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });

    if (!companyDetails) {
      return res.status(404).json({ success: false, message: 'Company details not found' });
    }

    res.status(200).json({
      success: true,
      message: "Company details fetched successfully",
      data: companyDetails
    });

  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching company details',
      error: error.message
    });
  }
});


module.exports = {
  // createCompanyDetail,
  getByIdCompanyDetail,
  updateCompanyDetails,
  getCompanyDetailByUser
};
