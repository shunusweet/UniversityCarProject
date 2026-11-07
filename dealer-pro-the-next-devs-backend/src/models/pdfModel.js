module.exports = (sequelize, DataTypes) => {
  const PdfData = sequelize.define('pdfData', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    agreementId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    corp_Id: { type: DataTypes.INTEGER, allowNull: false },

    pdf: {
      type: DataTypes.STRING,
      allowNull: false
    }
    
  }, {
    tableName: 'pdf_data',       
    timestamps: true,          
    underscored: true          
  });

  return PdfData;
};
