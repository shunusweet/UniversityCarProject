module.exports = (sequelize, DataTypes) => {
  const Corp = sequelize.define('Corp', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    corpName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'corp_name'
    },
    corpActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'corp_active'
    },
    allowedResources: {
      type: DataTypes.JSON,
      field: 'allowed_resources'
    }
  }, {
    tableName: 'corps',
    timestamps: true
  });

  Corp.associate = models => {
    Corp.hasMany(models.User, { foreignKey: 'corpId' });
    Corp.hasMany(models.Role, { foreignKey: 'corpId' });
  };

  return Corp;
};
