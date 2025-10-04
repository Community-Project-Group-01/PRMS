const express = require("express")
const { protectedRoutes } = require("../middleware/protectedRoutes")
const { getPrescriptionsByPatient, getPrescriptionById, deletePrescription } = require("../controllers/prescriptionController")

const prescriptionRouter = express.Router()

prescriptionRouter.get("/patient/:id", protectedRoutes, getPrescriptionsByPatient)
prescriptionRouter.get("/:id", protectedRoutes, getPrescriptionById)
prescriptionRouter.delete("/:id", protectedRoutes, deletePrescription)

module.exports = { prescriptionRouter }