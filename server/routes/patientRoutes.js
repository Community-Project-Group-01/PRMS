const express = require("express")
const { registerPatient, getAllPatients, getPatientById } = require("../controllers/patientController")
const { protectedRoutes } = require("../middleware/protectedRoutes")

const patientRouter = express.Router()

patientRouter.post("/register", registerPatient)
patientRouter.get("/getPatient", protectedRoutes, getAllPatients)
patientRouter.get("/getPatient/:id", protectedRoutes, getPatientById)

module.exports = { patientRouter }