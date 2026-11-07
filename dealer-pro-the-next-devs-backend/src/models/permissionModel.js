module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'permission_id'
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'role_id'
    },
    resourceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'resource_id'
    },
    canRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'can_read'
    },
    canCreate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'can_create'
    },
    canUpdate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'can_update'
    },
    canDelete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'can_delete'
    },
    subresourcePermissions: {
      type: DataTypes.JSON,
      field: 'subresource_permissions'
    }
  }, {
    tableName: 'permissions',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['permission_id'] },
      { fields: ['role_id'] },
      { fields: ['resource_id'] }
    ]
  });

  Permission.associate = models => {
    // Permission.belongsTo(models.Role, { foreignKey: 'roleId' });
    Permission.belongsTo(models.Role, { foreignKey: 'roleId' });

    Permission.belongsTo(models.Resource, { foreignKey: 'resourceId' });
  };

  return Permission;
};