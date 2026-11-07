const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const path = require("path");
// const db = require('../../Anni/Api/src/models/index.js');

const db = require('./src/models/index.js'); 

// Models
const User = db.User;

// Setup
const app = express();
const server = http.createServer(app);
app.set('trust proxy', true);

// Middleware
app.use(cors());

app.use(express.json()); // ✅ Handles JSON body
app.use(express.urlencoded({ extended: true })); // ✅ Handles URL-encoded body
// app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// API Routes
const authRouter = require('./src/routes/authRoutes.js');
const companyRouter = require('./src/routes/companyRoutes.js');
const corp = require('./src/routes/corpRoutes.js');
const customerRouter = require('./src/routes/customerRoutes.js');
const Org = require('./src/routes/orgRoutes.js');
const raac = require('./src/routes/rbacRoutes.js');
const scrapRouter = require('./src/routes/scrapRoutes.js');
const setting = require('./src/routes/settingRoutes.js');
const userRouter = require('./src/routes/userRoutes.js');
const prospect = require('./src/routes/prospectRoutes.js');
const agreementRoutes = require('./src/routes/agreementRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes.js'); // Vehicle routes
const invoiceRoutes = require('./src/routes/invoiceRoutes');
const receiptRoutes = require('./src/routes/receiptRoutes');  // Receipt routes
const payoutRoutes = require('./src/routes/payoutRoutes'); // Payout routes
const bankSignRoutes = require('./src/routes/bankSignRoutes.js');
const emailPdfRoutes = require('./src/routes/emailPdfRoutes.js');
const pdfDataRoutes = require('./src/routes/pdfroutes.js');
const companyDetail =require('./src/routes/compantDetailRoutes.js');
const openai = require('./src/routes/openaiRoutes.js');
const publicSigningRoutes = require('./src/routes/publicSigningRoutes.js');
const searchVehicleRoutes = require('./src/routes/searchVehicleRoute.js');
const blocket = require('./src/routes/blocketAdsRoute.js');


app.use('/api/auth', authRouter);
app.use('/api/company', companyRouter);
app.use('/api/corp', corp);
app.use('/api/customer', customerRouter);
app.use('/api/org', Org);
app.use('/api/rbac', raac);
app.use('/api/scrap', scrapRouter);
app.use('/api/setting', setting);
app.use('/api/user', userRouter);
app.use('/api/prospect', prospect);
app.use('/api/agreements', agreementRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/payouts', payoutRoutes); // Payout routes
app.use('/api/banksign', bankSignRoutes);
app.use('/api/sendpdf',pdfDataRoutes);
app.use('/api/pdf',pdfDataRoutes);
app.use('/api/email', emailPdfRoutes);
app.use('/api/companyDetail', companyDetail);
app.use('/api/openai', openai);
app.use('/api/publicsigning', publicSigningRoutes);
app.use('/api/searchVehicle', searchVehicleRoutes);
app.use('/api/blocket', blocket);

app.get('/api', (req, res) => {
    res.status(200).json({ status: 200, message: "API's are working" });
});

// Start Server
const PORT = process.env.PORT || 3001;

// Local development
if (process.env.NODE_ENV !== "production") {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
