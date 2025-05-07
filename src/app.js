require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const studentRoutes = require("./routes/studentRoutes");
const publicRoutes = require("./routes/public");
// const meRoute=require("./routes/user");

const app = express();

// ✅ Correct CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());


// ✅ Middleware
app.use(express.json()); 

// ✅ Routes
app.use("/api/auth", authRoutes);
// app.use("/api/user",meRoute);
app.use("/api/courses", courseRoutes);

app.use("/api/student", studentRoutes);

app.use("/api/public", publicRoutes);

module.exports = app;
