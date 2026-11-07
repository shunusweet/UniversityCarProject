  module.exports = (sequelize, DataTypes) => {
    const Org = sequelize.define('Org', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
      },
      corpId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'corp_id'
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: 'SE_ORG',
        field: '_type'
      },
    country: {
    type: DataTypes.STRING,
    allowNull: true // ✅ This is correct
  },
  legalId: {
    type: DataTypes.STRING,
    allowNull: true, // ✅ Also correct
    unique: true
  },
      addresses: DataTypes.JSON,
      urls: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      emails: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      phones: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      orgName: DataTypes.JSON,
      lifecycle: DataTypes.JSON,
      businessActivity: DataTypes.TEXT,
      primaryBusinessCategory: DataTypes.JSON,
      otherBusinessCategories: DataTypes.JSON,
      legalForm: DataTypes.JSON,
      boardMembers: DataTypes.JSON,
      headquarter: DataTypes.JSON,
      taxInfo: DataTypes.JSON,
      legalInfo: DataTypes.JSON,
      contactInfo: DataTypes.JSON,
      financials: DataTypes.JSON,
      manpower: DataTypes.JSON
    }, {
      tableName: 'organizations',
      timestamps: true,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['corp_id'] },
        { unique: true, fields: ['legalId'] }
      ]
    });

    Org.associate = models => {
      Org.belongsTo(models.User, { foreignKey: 'userId' });
      Org.belongsTo(models.Corp, { foreignKey: 'corpId' });
    };

    return Org;
  };
