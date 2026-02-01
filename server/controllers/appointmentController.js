const Appointment = require("../models/Appoinment")
const { Doctor } = require("../models/Doctor")
const { Patient } = require("../models/Patient")
const logger = require("../utils/logger")

// create Appointment
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
        const newAppointment = await Appointment.create({
            patient: patient._id,
            doctor: doctor._id
        })
        return res.status(200).json({ success: true, message: "Appoinment Success", data: newAppointment })
    }
    catch (error) {
        logger.error("Error in Create Appointment", { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// get all appointments of a Doctor
const getAppointmentsOfDoctor = async (req, res) => {
    try {
        const { status } = req.query;
        const userId = req.user._id;

        const doctor = await Doctor.findOne({ user: userId });
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const query = { doctor: doctor._id };
        if (status) query.status = status;

        const myAppointments = await Appointment.find(query)
            .populate({
                path: "patient",
                populate: {
                    path: "user",
                    select: "name email", // populate only name and email
                },
            })
            .lean();

        if (!myAppointments.length) {
            return res.status(200).json({ success: true, message: "No appointments found", data: [] });
        }

        return res.status(200).json({
            success: true,
            message: "Appointments fetched successfully",
            data: myAppointments,
        });
    } catch (error) {
        logger.error("Error fetching doctor appointments", { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// update appointments state
const updateAppointment = async (req, res) => {
    try {
        // const { id: appointmentId } = req.params;
        const { status, id: appointmentId } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required" });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Appointment updated successfully",
            data: appointment,
        });
    } catch (error) {
        logger.error("Error updating appointment", { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get a specific appointment by ID
const getAppointmentById = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const userId = req.user._id;

        const doctor = await Doctor.findOne({ user: userId });
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found", });
        }

        const appointment = await Appointment.findOne({
            _id: appointmentId,
            doctor: doctor._id,
        })
            .populate("patient", "name email phone age gender")
            .lean();

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Appointment fetched successfully",
            data: appointment,
        });
    } catch (error) {
        logger.error("Error fetching appointment by ID", { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = { createAppoinment, getAppointmentsOfDoctor, updateAppointment, getAppointmentById }