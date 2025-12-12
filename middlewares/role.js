module.exports = function allowedRoles(...roles) {
  return (req, res, next) => {
    // If auth middleware did not attach req.user, block access
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not logged in"
      });
    }

    // Check if user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission"
      });
    }

    next();
  };
};
