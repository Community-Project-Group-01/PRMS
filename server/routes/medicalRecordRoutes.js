const express = require("express")
const { protectedRoutes } = require("../middleware/protectedRoutes")
const { auditMiddleware } = require("../middleware/auditMiddleware")
const { createMedicalRecord, getRecordsByPatient, getRecordById } = require("../controllers/medicalRecordController")

const medicalRecordRouter = express.Router()

medicalRecordRouter.post("/add/:id", protectedRoutes, createMedicalRecord, auditMiddleware("CREATED_MEDICAL_RECORD"))
medicalRecordRouter.get("/patient/:id", protectedRoutes, getRecordsByPatient)
medicalRecordRouter.get("/record/:id", protectedRoutes, getRecordById)

module.exports = { medicalRecordRouter }