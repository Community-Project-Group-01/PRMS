const express = require("express")
const { protectedRoutes } = require("../middleware/protectedRoutes")
const { authorize } = require("../middleware/authorize")
const { validate } = require("../middleware/validate")
const { objectIdParams } = require("../validations/common")
const { createAppointmentSchema, updateAppointmentSchema } = require("../validations/appointmentValidation")
const { createAppoinment, getAppointmentsOfDoctor, updateAppointment, getAppointmentById } = require("../controllers/appointmentController")

const appointmentRouter = express.Router()

appointmentRouter.post(
  "/create",
  protectedRoutes,
  authorize("admin"),
  validate(createAppointmentSchema),
  createAppoinment
)
appointmentRouter.get("/getMyAppointments", protectedRoutes, authorize("doctor"), getAppointmentsOfDoctor)
appointmentRouter.put(
  "/update",
  protectedRoutes,
  authorize("doctor"),
  validate(updateAppointmentSchema),
  updateAppointment
)
appointmentRouter.get(
  "/:id",
  protectedRoutes,
  authorize("doctor"),
  validate(objectIdParams("id"), "params"),
  getAppointmentById
)

module.exports = { appointmentRouter }
