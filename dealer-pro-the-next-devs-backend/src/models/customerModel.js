module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('customer', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    customerId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'customer_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'user_id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,

      field: 'postal_code'
    },
    customerNumber: {
      type: DataTypes.STRING,
      unique: true,
      field: 'customer_number'
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true

    },
    type: {
      type: DataTypes.ENUM('Private', 'Company', 'Agency', 'Client','Agreement')
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    numberOfOrders: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true

    },
    totalSpent: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: true

    },
    latestPurchase: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    agreementType: {
      type: DataTypes.STRING,
      defaultValue: 'N/A'
    },
    socialSecurityNumber: {
      type: DataTypes.STRING,
      defaultValue: 'N/A'
    }
  
  });

  Customer.associate = models => {
    Customer.belongsTo(models.Corp, { foreignKey: 'corpId' });
    Customer.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Customer;
};
