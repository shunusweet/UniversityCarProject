const dbConfig = require('../database/database.js');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD || '', {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    timezone: '+05:00', //Set timeZone for PKT
});
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require('./userModel.js')(sequelize, DataTypes);
db.Role = require('./roleModel.js')(sequelize, DataTypes);
db.Corp = require('./corpModel.js')(sequelize, DataTypes);
db.company = require('./companyModel.js')(sequelize, DataTypes);
db.Resource = require('./resourceModel.js')(sequelize, DataTypes);
db.Permission = require('./permissionModel.js')(sequelize, DataTypes);
db.org= require('./orgModel.js')(sequelize, DataTypes);
db.theme = require('./themeModel.js')(sequelize, DataTypes);
db.deviceVerification = require('./deviceVerificationModel.js')(sequelize, DataTypes);
db.customer = require('./customerModel.js')(sequelize, DataTypes);
db.prospectingList = require('./prospectModel.js')(sequelize, DataTypes);
db.Agreement = require('./agreement.js')(sequelize, DataTypes);
db.Payment = require('./payment.js')(sequelize, DataTypes);
db.Vehicle = require('./vehicle.js')(sequelize, DataTypes);
db.invoice =require('./invoice.js')(sequelize, DataTypes)
db.Receipt = require('./receipt')(sequelize, DataTypes);  // Ensure correct path and initialization
db.payout = require('./payoutModel.js')(sequelize, DataTypes);

db.SignedAgreement = require('./signedAgreement.js')(sequelize, DataTypes);
db.PdfData = require('./pdfModel.js')(sequelize, DataTypes);
db.CompanyDetails = require('./companyDetail.js')(sequelize, DataTypes);
db.SignedAgreement = require('./signedAgreement.js')(sequelize, DataTypes);
db.publicsigningsessions = require('./publicsigningsessions.js')(sequelize, DataTypes);
db.searchvehiclle = require('./searchVehicle.js')(sequelize, DataTypes);
db.ads = require('./blocketAdsModel.js')(sequelize, DataTypes);
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

db.sequelize.sync({ force: false })
    .then(() => {
        console.log("Sequelize synchronized with database.");
    })
    .catch(err => {
        console.error("Error syncing Sequelize with database:", err);
    });

// sequelize.sync({ alter: true });

module.exports = db;