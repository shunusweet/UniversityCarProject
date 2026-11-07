// src/models/receipt.js
module.exports = (sequelize, DataTypes) => {
  const Receipt = sequelize.define('Receipt', {


    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    receiptID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,  // This marks receiptID as the primary key
    },
    agreementID: {
      type: DataTypes.STRING,
      allowNull: true,  // Agreement ID is required
    },

    amount: {
      type: DataTypes.FLOAT,
      allowNull: true,  // Amount is required
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,  // Date is required
    },
 userId: {
      type: DataTypes.INTEGER,
      allowNull: true  // ✅ Still required, but no foreign key constraint
    },
    corp_Id: {
      type: DataTypes.INTEGER,
      allowNull: true  // Corporation ID is required
    },
  }, {
    tableName: 'receipts',  // The name of the table in the database
    timestamps: false  // No createdAt or updatedAt columns will be created
  });

  return Receipt;  // Ensure that the Receipt model is returned
};
