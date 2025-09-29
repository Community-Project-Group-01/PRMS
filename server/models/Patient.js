const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        nic: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        patientType: {
            type: String,
            enum: ["Student", "Public", "Staff"],
            required: true,
        },
        allergies: {
            type: [String],
            default: [],
        },
        contact: {
            type: String,
            default: "",
        },
        address: {
            type: String,
            default: "",
        },
        dob: {
            type: Date,
        },
    },
    { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = { Patient }
