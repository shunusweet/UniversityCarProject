module.exports = (sequelize, DataTypes) => {
  const Resource = sequelize.define('Resource', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    resourceId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'resource_id'
    },
    resourceActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'resource_active'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_public'
    },
    hasSubresources: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'has_subresources'
    },
    subresources: {
      type: DataTypes.JSON // [{ title, route, icon }]
    }
  }, {
    tableName: 'resources',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['resource_id'] },
      { unique: true, fields: ['route'] }
    ]
  });

  return Resource;
};
