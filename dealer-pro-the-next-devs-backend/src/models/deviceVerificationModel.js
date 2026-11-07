module.exports = (sequelize, DataTypes) => {
  const DeviceVerification = sequelize.define('DeviceVerification', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'device_id'
    },
    deviceName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'device_name'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified'
    },
    otp: {
      type: DataTypes.STRING
    },
    otpExpiresAt: {
      type: DataTypes.DATE,
      field: 'otp_expires_at'
    },
    lastOtpSentAt: {
      type: DataTypes.DATE,
      field: 'last_otp_sent_at'
    },
    otpAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'otp_attempts'
    },
    lastVerifiedAt: {
      type: DataTypes.DATE,
      field: 'last_verified_at'
    }
  }, {
    tableName: 'device_verifications',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'device_id']
      }
    ]
  });

  DeviceVerification.associate = models => {
    DeviceVerification.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return DeviceVerification;
};
