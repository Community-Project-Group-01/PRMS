const express = require("express")
const { registerDoctor, getAllDoctors, getDoctorById, updateDoctor } = require("../controllers/doctorController")
const { protectedRoutes } = require("../middleware/protectedRoutes")
const { auditMiddleware } = require("../middleware/auditMiddleware")

const doctorRouter = express.Router()
doctorRouter.post("/register", auditMiddleware("CREATE_DOCTOR"), registerDoctor)
doctorRouter.get("/getDoctor", protectedRoutes, getAllDoctors)
doctorRouter.get("/getDoctor/:id", protectedRoutes, getDoctorById)
doctorRouter.post("/update", protectedRoutes, auditMiddleware("UPDATE_DOCTOR"), updateDoctor)

module.exports = { doctorRouter }