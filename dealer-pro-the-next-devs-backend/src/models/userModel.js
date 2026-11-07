module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
 id: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true
},
corpId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  
},
roleId: {
  type: DataTypes.INTEGER,
  allowNull: false,

},
    corpName: {
      type: DataTypes.STRING,
       allowNull: false,
    },
    first: {
      type: DataTypes.STRING
    },
    last: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    phone: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'two_factor_enabled'
    },
    resetToken: {
      type: DataTypes.STRING,
      field: 'reset_token'
    },
    resetTokenExpires: {
      type: DataTypes.DATE,
      field: 'reset_token_expires'
    }
  }, {
    tableName: 'users',
    timestamps: true,
  indexes: [
  { unique: true, fields: ['id'] },
  { fields: ['corpId'] },
  { fields: ['roleId'] },
  { unique: true, fields: ['email'] }
]

  });
// ✅ Correctly define associate function with 'models' as argument
  User.associate = function (models) {
    User.belongsTo(models.Corp, { foreignKey: 'corpId' });

    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'Role' // 👈 Important for include or alias-based access
    });
  };




  return User;
};
