const express = require("express");
const { getAdminStats, updateAdmin } = require("../controllers/adminController");
const { protectedRoutes } = require("../middleware/protectedRoutes");
const { auditMiddleware } = require("../middleware/auditMiddleware");

const router = express.Router();

// Admin-only routes
router.get("/stats", protectedRoutes, getAdminStats);
router.post("/update", protectedRoutes, auditMiddleware("UPDATE_ADMIN"), updateAdmin);

module.exports = router;
