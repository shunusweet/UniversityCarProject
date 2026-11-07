module.exports = (sequelize, DataTypes) => {
  const PublicSigningSession = sequelize.define(
    "PublicSigningSessions",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true
      },
      agreementId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      accessToken: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      expiryTimestamp: {
        type: DataTypes.DATE,
        allowNull: false
      },
      emailSent: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      smsSent: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      isUsed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      usedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: "PublicSigningSessions",
      timestamps: true
    }
  );

  return PublicSigningSession;
};
