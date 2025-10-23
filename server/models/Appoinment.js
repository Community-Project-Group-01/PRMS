const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
        status: {
            type: String,
            enum: ["Queue", "Consultation", "Closed"],
            default: "Queue",
        },
    },
    { timestamps: true }
);

const Appointment =
    mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
