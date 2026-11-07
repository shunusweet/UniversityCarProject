module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    // Invoice Details
    id:{type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    corp_Id: { type: DataTypes.INTEGER, allowNull: false },


    invoiceNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    orgNumber: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Pending' },
    invoiceDate: { type: DataTypes.DATE, allowNull: false },
    dueDate: { type: DataTypes.DATE, allowNull: false },
    expirationDate: { type: DataTypes.DATE, allowNull: true },
    currency: { type: DataTypes.STRING, allowNull: true, defaultValue: 'SEK' },
    language: { type: DataTypes.STRING, allowNull: true },
    website: { type: DataTypes.STRING, allowNull: true },

    // Customer Info
    customerType: { type: DataTypes.STRING, allowNull: false },
    customerName: { type: DataTypes.STRING, allowNull: true }, // ✅ NEW FIELD
    email: { type: DataTypes.STRING, allowNull: true },
    telephoneNumber: { type: DataTypes.STRING, allowNull: true },
    inReference: { type: DataTypes.STRING, allowNull: true },
    ourReference: { type: DataTypes.STRING, allowNull: true },

    // Totals
    net: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    moms: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    amount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },

    // Line Items
    items: { type: DataTypes.JSON, allowNull: true, defaultValue: [] }
  }, {
    tableName: 'invoices',
    timestamps: true,
  });

  return Invoice;
};
