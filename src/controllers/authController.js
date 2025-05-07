const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const {generateAccessToken,generateRefreshToken} = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

// console.log("generateAccessToken type:", typeof generateAccessToken);
// Map lowercase role to enum Role
const roleMap = {
  student: "STUDENT",   
  instructor: "INSTRUCTOR",
};

// // Generate refresh token separately
// const generateRefreshToken = (id) => {
//   return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
// };
 
// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: roleMap[role.toLowerCase()] || "STUDENT",
      },
    });

    const accessToken = generateAccessToken(newUser.id, newUser.role);
    const refreshToken = generateRefreshToken(newUser.id);

    // Save refreshToken in database
    await prisma.user.update({
      where: { id: newUser.id },
      data: { refreshToken },
    });

    // Send refresh token in HttpOnly cookie
    res.cookie("accessToken", accessToken,{
      httpOnly:true,
      maxAge: 1*24*60*60*1000
    })
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({ accessToken });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

  // Login
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const accessToken = generateAccessToken(user.id, user.role);
      const refreshToken = generateRefreshToken(user.id);

      // Save refreshToken in database
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      res.cookie("accessToken", accessToken,{
        httpOnly:true,
        maxAge: 1*24*60*60*1000
      })
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ accessToken });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Login failed" });
    }
  };

// Refresh token
exports.refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token found" });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user.id, user.role);

    res.status(200).json({ accessToken: newAccessToken });

  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// Logout
// const jwt = require("jsonwebtoken");
// const prisma = require("../prisma"); // adjust if needed

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(200).json({ message: "Already logged out" });
    }

    try {
        decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    } catch (err) {
      console.error("JWT verification error:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    // Invalidate the token in DB
    await prisma.user.update({
      where: { id: decoded.id },
      data: { refreshToken: null },
    });

    // Clear the cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout failed:", err.message);
    return res.status(500).json({ message: "Logout failed" });
  }
};
