const express = require("express")
const { protectedRoutes } = require("../middleware/protectedRoutes")
const { createAppoinment } = require("../controllers/appointmentController")

const appointmentRouter = express.Router()

appointmentRouter.post("/create", protectedRoutes, createAppoinment)

module.exports = { appointmentRouter }