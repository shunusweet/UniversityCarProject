
const crypto = require("crypto");

const generateId = (prefix = "") => {
  const uniquePart = crypto.randomBytes(8).toString("hex");
  return `${prefix}_${Date.now()}_${uniquePart}`;
};

module.exports = {
  generateId
};
