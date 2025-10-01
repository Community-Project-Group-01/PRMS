const express = require("express")
const { registerDoctor, getAllDoctors, getDoctorById, updateDoctor } = require("../controllers/doctorController")
const { protectedRoutes } = require("../middleware/protectedRoutes")

const doctorRouter = express.Router()
doctorRouter.post("/register", registerDoctor)
doctorRouter.get("/getDoctor", protectedRoutes, getAllDoctors)
doctorRouter.get("/getDoctor/:id", protectedRoutes, getDoctorById)
doctorRouter.post("/update", protectedRoutes, updateDoctor)

module.exports = { doctorRouter }