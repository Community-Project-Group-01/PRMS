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
            enum: ["student", "public", "staff"],
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
            required: true
        },
    },
    { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = { Patient }
