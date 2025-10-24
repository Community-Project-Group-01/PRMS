const express = require("express")
const { protectedRoutes } = require("../middleware/protectedRoutes")
const { createAppoinment, getAppointmentsOfDoctor, updateAppointment, getAppointmentById } = require("../controllers/appointmentController")

const appointmentRouter = express.Router()

appointmentRouter.post("/create", protectedRoutes, createAppoinment)
appointmentRouter.get("/getMyAppointments", protectedRoutes, getAppointmentsOfDoctor)
appointmentRouter.put("/:id", protectedRoutes, updateAppointment)
appointmentRouter.get("/:id", protectedRoutes, getAppointmentById)

module.exports = { appointmentRouter }