// models/Ads.js
module.exports = (sequelize, DataTypes) => {
  const ads = sequelize.define("ads", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    source_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dealer_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    price_currency: {
      type: DataTypes.STRING,
      defaultValue: "SEK",
    },
    image_urls: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    municipality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    blocket_ad_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bytbil_ad_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.ENUM("created", "deleted", "error"),
      defaultValue: "created",
    },
    logs: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    mileage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fuel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gearbox: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    year_model: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    synced: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: "ads",
    timestamps: true, // createdAt, updatedAt auto add honge
  });

  return ads;
};
