const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const db = require("../models"); // Sequelize models
const User = db.User;

const protect = asyncHandler(async (req, res, next) => {
  try {
    let token;

    // Prefer Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.headers.token) {
      token = req.headers.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // Verify token with secret (auto handles expiry)
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Find active user
    const user = await User.findOne({
      where: { id: decoded.user_id, active: true },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(403).json({ message: "User not found or inactive" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Auth Error:", error.message);
    return res.status(403).json({ message: "Invalid JWT token or session expired" });
  }
});

module.exports = { protect };
