const express = require("express");
const { getAdminStats } = require("../controllers/adminController");
const { protectedRoutes } = require("../middleware/protectedRoutes");

const router = express.Router();

// Admin-only routes
router.get("/stats", protectedRoutes, getAdminStats);

module.exports = router;
