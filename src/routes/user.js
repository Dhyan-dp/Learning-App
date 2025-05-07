  const express = require("express");
  const router = express.Router();
  // const { authenticate } = require("../middlewares/authMiddleware"); // or your path
  const authenticateJWT = require('../middlewares/authMiddleware'); // ✅ Correctly assigned

  const { PrismaClient } = require("../../generated/prisma");
  const prisma = new PrismaClient();

  // GET /api/me
  router.get("/", authenticateJWT, async (req, res) => { 
    try { 
      const user = await prisma.user.findFirst({
        where: { id: req.user.id },
        select: { id: true, name: true, email: true, role: true },
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  module.exports = router;
