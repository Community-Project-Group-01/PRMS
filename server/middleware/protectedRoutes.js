const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const protectedRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorised Access" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Token Invalid" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "No user found" });
    }
    req.user = user;
    next();
  } catch (error) {
    const logger = require("../utils/logger");
    logger.error("Error in protectedRoutes", { error: error.message, stack: error.stack });

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }
};

module.exports = { protectedRoutes };
