function authorizeRoles(...allowedRoles) {
  return function (req, res, next) {
    console.log("Checking role:", req.user?.role);
    
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient rights" });
    }

    next();
  };
}

module.exports = authorizeRoles;
