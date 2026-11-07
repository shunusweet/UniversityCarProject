module.exports = (sequelize, DataTypes) => {
  const Theme = sequelize.define('Theme', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    corpId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'corp_id'
    },
    theme: {
      type: DataTypes.STRING,
      defaultValue: '#3b82f6',
      validate: {
        is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i
      }
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'updated_by'
    },
    updatedAtManual: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'themes',
    timestamps: true, // Adds createdAt and updatedAt automatically
    indexes: [
      { unique: true, fields: ['corp_id'] }
    ]
  });

  Theme.associate = models => {
    // Theme.belongsTo(models.Corp, { foreignKey: 'corpId', targetKey: 'corpId' });
    Theme.belongsTo(models.Corp, { foreignKey: 'corpId' }); // ✅ No need for targetKey

    Theme.belongsTo(models.User, { foreignKey: 'updatedBy', targetKey: 'id' });
  };

  return Theme;
};
