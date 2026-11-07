
module.exports = (sequelize, DataTypes) => {
const Payout = sequelize.define('Payout', {

  id: {
    type: DataTypes.INTEGER,
    allowNull: false,        // <- now nullable in the DB
    autoIncrement: true,
    primaryKey: true
  },
  corpId: {
    type: DataTypes.INTEGER,
    allowNull: true,        // <- now nullable in the DB
    field: 'corp_id'
  },
  payoutInstructionUUID: {
    type: DataTypes.UUID,             // use the UUID data type
    defaultValue: DataTypes.UUIDV4,   // auto-generate a v4 UUID
    allowNull: false,
    unique: true
  },
  payerPaymentReference: {
    type: DataTypes.STRING(35),
    allowNull: false
  },
  signingCertificateSerialNumber: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  payerAlias: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  payeeAlias: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  payeeSSN: {
    type: DataTypes.STRING(12),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'SEK'
  },
  payoutType: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'PAYOUT'
  },
  instructionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  callbackUrl: {
    type: DataTypes.STRING(684),
    allowNull: false
  },
  signature: {
    type: DataTypes.TEXT, // Base64 string, long
    allowNull: false
  },
  callbackIdentifier: {
    type: DataTypes.STRING(36),
    allowNull: true,
    validate: {
      is: /^[0-9a-zA-Z-]{32,36}$/
    }
  }
}, {
  tableName: 'payouts'
});

return Payout;

}