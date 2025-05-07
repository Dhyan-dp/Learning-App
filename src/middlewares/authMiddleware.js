// const jwt = require("jsonwebtoken");
// const { PrismaClient } = require("../../generated/prisma");
// const prisma = new PrismaClient();

// const authenticate = async (req, res, next) => {
//   // console.log("auth")
//   const authHeader = req.headers.authorization; 
  
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Access token missing" });
//   }
 
//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     const user = await prisma.user.findUnique({ where: { id: decoded.id } });

//     if (!user) return res.status(401).json({ message: "User not found" });

//     req.user = user; // Attach full user to request
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };


// module.exports = authenticate;


const jwt = require("jsonwebtoken");
const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
  const token = req.cookies.accessToken; // ✅ Get token from cookie

  if (!token) {
    return res.status(401).json({ message: "Access token missing from cookie" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    const user = await prisma.user.findFirst({ where: { id: decoded.id } });

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
