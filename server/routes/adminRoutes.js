const express = require("express");
const { getAdminStats, updateAdmin } = require("../controllers/adminController");
const { protectedRoutes } = require("../middleware/protectedRoutes");
const { authorize } = require("../middleware/authorize");
const { auditMiddleware } = require("../middleware/auditMiddleware");
const { validate } = require("../middleware/validate");
const { updateAdminSchema } = require("../validations/adminValidation");

const router = express.Router();

// Admin-only routes
router.get("/stats", protectedRoutes, authorize("admin"), getAdminStats);
router.post(
  "/update",
  protectedRoutes,
  authorize("admin"),
  validate(updateAdminSchema),
  auditMiddleware("UPDATE_ADMIN"),
  updateAdmin
);

module.exports = router;
