module.exports = (sequelize, DataTypes) => {
  const CompanyDetails = sequelize.define('CompanyDetails', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    corp_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    legalEntityType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateOfRegistration: {
      type: DataTypes.DATE,
      allowNull: true
    },
    vatNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fTaxStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    visitingAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mailingAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bicSwift:{
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    first: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    roleTitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bankAccountNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    iban_Bic: {
      type: DataTypes.STRING,
      allowNull: true
    },
    swish_Number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    payment_Terms: {
      type: DataTypes.STRING,
      allowNull: true
    },
    late_payment_interest_rate: {
      type: DataTypes.FLOAT,
      allowNull: true,
      set(value) {
        this.setDataValue('late_payment_interest_rate', value === "" ? null : value);
      }
    },
    invoice_Fee: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    invoice_number_prefix: {
      type: DataTypes.STRING,
      allowNull: true
    },
    invoice_number_counter: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    default_invoice_message: {
      type: DataTypes.STRING,
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true
    },
    invoice_language: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reference_person: {
      type: DataTypes.STRING,
      allowNull: true
    },
    auto_debit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    contract_terms: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    contract_duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    signing_method: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contract_contact_person: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contract_version_control: {
      type: DataTypes.STRING,
      allowNull: true
    },
    attachments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    business_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    industry_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    preferred_language: {
      type: DataTypes.STRING,
      allowNull: true
    },
    api_keys: {
      type: DataTypes.JSON,
      allowNull: true
    },
    tax_vat_settings: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'company_details',
    timestamps: true
  });

  CompanyDetails.associate = models => {
    CompanyDetails.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return CompanyDetails;
};
