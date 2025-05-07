const jwt = require("jsonwebtoken");

const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "15m" }); // 15 min
};

const generateRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" }); // 7 days
};

module.exports = { generateAccessToken, generateRefreshToken };
  