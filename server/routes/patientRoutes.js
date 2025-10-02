const express = require("express")
const { registerPatient, getAllPatients, getPatientById, updatePatient } = require("../controllers/patientController")
const { protectedRoutes } = require("../middleware/protectedRoutes")
const { auditMiddleware } = require("../middleware/auditMiddleware")

const patientRouter = express.Router()

patientRouter.post("/register", auditMiddleware("CREATE_PATIENT"), registerPatient)
patientRouter.get("/getPatient", protectedRoutes, getAllPatients)
patientRouter.get("/getPatient/:id", protectedRoutes, getPatientById)
patientRouter.post("/update", protectedRoutes, auditMiddleware("UPDATE_PATIENT"), updatePatient)

module.exports = { patientRouter }