const express = require("express")
const { protectedRoutes } = require("../middleware/protectedRoutes")
const { auditMiddleware } = require("../middleware/auditMiddleware")
const { createMedicalRecord } = require("../controllers/medicalRecordController")

const medicalRecordRouter = express.Router()

medicalRecordRouter.post("/add/:id", protectedRoutes, auditMiddleware("CREATED_MEDICAL_RECORD"), createMedicalRecord)

module.exports = { medicalRecordRouter }