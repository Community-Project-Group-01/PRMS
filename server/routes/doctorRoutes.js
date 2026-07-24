const express = require("express")
const { registerDoctor, getAllDoctors, getDoctorById, updateDoctor, getDoctorStats } = require("../controllers/doctorController")
const { protectedRoutes } = require("../middleware/protectedRoutes")
const { authorize } = require("../middleware/authorize")
const { auditMiddleware } = require("../middleware/auditMiddleware")
const { validate } = require("../middleware/validate")
const { registerDoctorSchema, updateDoctorSchema } = require("../validations/doctorValidation")

const doctorRouter = express.Router()

// Only admins create doctor accounts
doctorRouter.post(
  "/register",
  protectedRoutes,
  authorize("admin"),
  validate(registerDoctorSchema),
  auditMiddleware("CREATE_DOCTOR"),
  registerDoctor
)
doctorRouter.get("/stats", protectedRoutes, authorize("doctor"), getDoctorStats)
doctorRouter.get("/getDoctor", protectedRoutes, authorize("admin"), getAllDoctors)
doctorRouter.get("/getDoctor/:id", protectedRoutes, authorize("admin"), getDoctorById)
doctorRouter.post(
  "/update",
  protectedRoutes,
  authorize("doctor"),
  validate(updateDoctorSchema),
  auditMiddleware("UPDATE_DOCTOR"),
  updateDoctor
)

module.exports = { doctorRouter }
