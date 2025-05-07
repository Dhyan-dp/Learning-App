const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userRoute = require("./user");
// Auth Routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/refresh", authController.refreshAccessToken);
router.post("/logout", authController.logout);
router.use("/me",userRoute);

module.exports = router;
 