module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
       type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    customer_reference: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payment_category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    social_security_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telephone_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    amount_items: {
      type: DataTypes.JSON,
      allowNull: true
    },
    total_amount: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    status: {
      type: DataTypes.ENUM('In Stock', 'Sold'),
       allowNull: true,
    }
  }, {
    tableName: 'payments',
    timestamps: true
  });

  return Payment;
};
