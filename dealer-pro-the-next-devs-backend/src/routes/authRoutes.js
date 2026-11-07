const express = require("express");
const router = express.Router();

const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Define routes
router.post("/login", authController.loginUser);
router.post("/signup", authController.signUpUser);
router.post("/token-check", authController.tokenCheck);
router.post("/refresh-token", authController.refreshUserToken);
router.get("/me", protect, authController.getUserInfo);
router.post("/verify-otp", authController.verifyOTP);
router.post("/resend-otp", authController.resendOTP);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/change-password", protect, authController.changePassword);

// Export router
module.exports = router;
