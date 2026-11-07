
module.exports = (sequelize, DataTypes) => {
  const ProspectingList = sequelize.define('ProspectingList', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    listName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    business: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    industries: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
     datum: {
       type: DataTypes.DATE,
      allowNull: false,
    defaultValue: DataTypes.NOW
     },
   
  });

  return ProspectingList;
};
