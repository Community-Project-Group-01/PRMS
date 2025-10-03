const mongoose = require("mongoose");


const prescriptionItemSchema = new mongoose.Schema({
    drug: { type: String, required: true }, // Drug name (or reference to Inventory model if needed)
    dosage: { type: String, required: true }, // e.g., "500mg twice daily"
    instructions: { type: String }, // Optional additional notes
    duration: { type: String } // e.g., "5 days"
});

const prescriptionSchema = new mongoose.Schema(
    {
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor", // Doctor user
            required: true,
        },
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        medicalRecord: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MedicalRecord",
            required: true,
        },
        items: [prescriptionItemSchema],
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = { Prescription };
