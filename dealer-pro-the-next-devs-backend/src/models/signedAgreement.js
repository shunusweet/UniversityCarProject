module.exports = (sequelize, DataTypes) => {
  const SignedAgreement = sequelize.define(
    "SignedAgreement",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      agreementID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      corp_Id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow null for public access
      },
      orderRef: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      stats: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isPublicAccess: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: "Whether this agreement was accessed via public link",
      },
      accessToken: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: "JWT token used for public access",
      },
      publicLinkExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "When the public access link expires",
      },
      publicAccessEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Email address used for public access",
      },
      publicAccessPhone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: "Phone number used for public access",
      },
      createdViaPublicLink: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Whether this signing session was initiated via public link",
      },
    },
    {
      tableName: "signed_agreements",
      timestamps: true, // adds createdAt and updatedAt
    }
  );

  return SignedAgreement;
};
