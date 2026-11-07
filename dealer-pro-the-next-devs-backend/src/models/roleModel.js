module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
   id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true // ✅ Important!
},
    corpId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'corps', key: 'id' }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    isSystem: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_system'
    }
  }, {
    tableName: 'roles',
    timestamps: true
  });

  Role.associate = models => {
    Role.belongsTo(models.Corp, { foreignKey: 'corpId' });
    // Role.hasMany(models.User, { foreignKey: 'roleId' });
    Role.hasMany(models.Permission, { foreignKey: 'roleId', as: 'Permissions' });

  };

  return Role;
};
