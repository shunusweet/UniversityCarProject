module.exports = (sequelize, DataTypes) => {
  const Agreement = sequelize.define(
    "Agreement",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: true },
      registrationNumber: { type: DataTypes.STRING, allowNull: true },
      corp_Id: { type: DataTypes.INTEGER, allowNull: true },
      purchaseDate: { type: DataTypes.DATEONLY, allowNull: true },
      email: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      purchasePrice: { type: DataTypes.STRING, allowNull: true },
      paymentMethod: { type: DataTypes.STRING, allowNull: true },
      vatType: { type: DataTypes.STRING, allowNull: true },
      creditMarking: { type: DataTypes.STRING, allowNull: true },
      mileage: { type: DataTypes.INTEGER, allowNull: true },
      latestService: { type: DataTypes.DATEONLY, allowNull: true },
      numberOfKeys: { type: DataTypes.INTEGER, allowNull: true },
      deck: { type: DataTypes.STRING, allowNull: true },
      notes: { type: DataTypes.STRING, allowNull: true },
      creditor: { type: DataTypes.STRING, allowNull: true },
      depositor: { type: DataTypes.STRING, allowNull: true },
      creditAmount: { type: DataTypes.STRING, allowNull: true },
      name: { type: DataTypes.STRING, allowNull: true },
      customerType: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: true },
      birthDate: { type: DataTypes.DATEONLY, allowNull: true },
      gender: { type: DataTypes.STRING, allowNull: true },

      // Extended fields
      salesDate: { type: DataTypes.DATEONLY, allowNull: true },
      commissionRate: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      commissionAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      agencyFee: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      insurer: { type: DataTypes.STRING, allowNull: true },
      insurerType: { type: DataTypes.STRING, allowNull: true },
      warrantyProvider: { type: DataTypes.STRING, allowNull: true },
      warrantyProduct: { type: DataTypes.STRING, allowNull: true },
      socialSecurityNumber: { type: DataTypes.STRING, allowNull: true },
      organizationNumber: { type: DataTypes.STRING, allowNull: true },
      tradeInType: { type: DataTypes.STRING, allowNull: true },
      tradeInRegistrationNumber: { type: DataTypes.STRING, allowNull: true },
      tradeInPurchaseDate: { type: DataTypes.STRING, allowNull: true },
      tradeInPurchasePrice: { type: DataTypes.STRING, allowNull: true },
      tradeInMileage: { type: DataTypes.STRING, allowNull: true },
      tradeInCreditMaking: { type: DataTypes.STRING, allowNull: true },
      type: { type: DataTypes.STRING, allowNull: true }, // Added missing type field

      // New fields from the image
      vehicleModel: { type: DataTypes.STRING, allowNull: true },
      // Temporarily removing vehicleBrand field until migration is complete
      chassisNumber: { type: DataTypes.STRING, allowNull: true },
      color: { type: DataTypes.STRING, allowNull: true },
      vehicleYear: { type: DataTypes.STRING, allowNull: true },
      fuelType: { type: DataTypes.STRING, allowNull: true },
      gearbox: { type: DataTypes.STRING, allowNull: true },
      salesPriceSEK: { type: DataTypes.STRING, allowNull: true },
      tires: { type: DataTypes.STRING, allowNull: true },
      insuranceType: { type: DataTypes.STRING, allowNull: true },
      // warrantyProduct: { type: DataTypes.STRING, allowNull: true },
      freeTextMessage: { type: DataTypes.STRING, allowNull: true },
      status: {
        type: DataTypes.ENUM("Created", "Signed"),
        allowNull: true,
      },
      directimport: {
        type: DataTypes.BOOLEAN,
        allowNull: false, // or true, if your column allows NULL
        defaultValue: false, // or 0, if you want the default to be “false”
        field: "directimport", // only needed if your JS key differs from the column name
      },
      deliveryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "deliveryDate",
      },
      deliveryLocation: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "deliveryLocation",
      },
      deliveryTerms: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "deliveryTerms",
      },
      latestServiceDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "latestServiceDate",
      },
      pep: {
        type: DataTypes.BOOLEAN, // maps to TINYINT(1)
        allowNull: true,
        field: "pep",
      },
      verification: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "verification",
      },

      tradeInRestAmount: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "tradeInRestAmount",
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bank: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      settlementDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      payoutDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Sales Agreement specific fields
      financialCompany: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      creditAmountSales: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cashStack: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      loanPeriod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "agreements",
      timestamps: true,
    }
  );

  return Agreement;
};
