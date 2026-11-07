module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    companyId: DataTypes.STRING,
    organisationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    businessUnitId: DataTypes.STRING,
    name: DataTypes.STRING,
    visitorAddress: DataTypes.JSON, // { addressLine, zipCode, postPlace }
    postalAddress: DataTypes.JSON,
    email: DataTypes.STRING,
    homePage: DataTypes.STRING,
    location: DataTypes.JSON, // { countryPart, county, municipality, coordinates }
    phoneNumbers: DataTypes.JSON, // { telephoneNumber, mobilePhone, faxNumber }
    marketingProtection: DataTypes.STRING,
    displayName: DataTypes.STRING,
   naceCategories: {
  type: DataTypes.JSON,
  defaultValue: []
},
proffNames: {
  type: DataTypes.JSON,
  defaultValue: []
},

    revenue: DataTypes.STRING,
    profit: DataTypes.STRING,
    currency: DataTypes.STRING,
    companyAccountsLastUpdatedDate: DataTypes.STRING,
    foundationYear: DataTypes.STRING,
    foundationDate: DataTypes.STRING,
    numberOfEmployees: DataTypes.STRING,
    status: DataTypes.JSON, // { status, description, statusDate }
    companyRoles: DataTypes.JSON,
    personRoles: DataTypes.JSON, // array of roles
    mainOffice: DataTypes.STRING,
    secretData: DataTypes.JSON,
    note: DataTypes.STRING
  }, {
    tableName: 'companies',
    timestamps: true
  });

  return Company;
};
