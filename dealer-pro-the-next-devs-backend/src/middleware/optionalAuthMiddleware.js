// optionalAuthMiddleware.js - Middleware for routes that support both public and authenticated access

const jwt = require("jsonwebtoken");
const { User } = require("../models");

/**
 * Optional authentication middleware
 * Unlike the regular auth middleware, this doesn't reject unauthenticated requests
 * It just adds user info if authentication is present
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (user) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we don't reject the request
        console.log("Invalid auth token in optional auth:", error.message);
      }
    }

    // Always continue to next middleware/route handler
    next();
  } catch (error) {
    console.error("Error in optional auth middleware:", error);
    next(); // Continue even if there's an error
  }
};

module.exports = { optionalAuth };
