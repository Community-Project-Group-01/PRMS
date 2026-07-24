const express = require("express")
const { registerPatient, getAllPatients, getPatientById, updatePatient } = require("../controllers/patientController")
const { protectedRoutes } = require("../middleware/protectedRoutes")
const { authorize } = require("../middleware/authorize")
const { auditMiddleware } = require("../middleware/auditMiddleware")
const { validate } = require("../middleware/validate")
const { registerPatientSchema, updatePatientSchema } = require("../validations/patientValidation")

const patientRouter = express.Router()

// Only admins create patient accounts
patientRouter.post(
  "/register",
  protectedRoutes,
  authorize("admin"),
  validate(registerPatientSchema),
  auditMiddleware("CREATE_PATIENT"),
  registerPatient
)
patientRouter.get("/getPatient", protectedRoutes, authorize("admin", "doctor"), getAllPatients)
patientRouter.get("/getPatient/:id", protectedRoutes, authorize("admin", "doctor"), getPatientById)
patientRouter.post(
  "/update",
  protectedRoutes,
  authorize("patient"),
  validate(updatePatientSchema),
  auditMiddleware("UPDATE_PATIENT"),
  updatePatient
)

module.exports = { patientRouter }
