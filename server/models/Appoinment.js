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
            enum: ["Queue", "Consultant", "Closed"],
            default: "Closed",
        },
    },
    { timestamps: true }
);

const Appointment =
    mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
