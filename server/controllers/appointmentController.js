const Appointment = require("../models/Appoinment")
const { Doctor } = require("../models/Doctor")
const { Patient } = require("../models/Patient")


const createAppoinment = async (req, res) => {
    try {
        const { doctorId, patientId } = req.body
        const doctor = await Doctor.findOne({ user: doctorId })
        if (!doctor) {
            return res.status(404).json({ success: false, message: "No Doctor available" })
        }
        const patient = await Patient.findOne({ user: patientId })
        if (!patient) {
            return res.status(404).json({ success: false, message: "No Patient available" })
        }
        const newAppointment = Appointment.create({
            patient: patientId,
            doctor: doctorId
        })
        return res.status(200).json({ success: true, message: "Appoinment Success", data: newAppointment })
    }
    catch (error) {
        console.error("Error in Create Appointment:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = { createAppoinment }