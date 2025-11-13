const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        nic: {
            type: String,
            required: true,
            unique: true,
            trim: true,
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
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true,
        },
        allergies: {
            type: [String],
            default: [],
        },
        contact: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        dob: {
            type: Date,
            required: true,
        },
        age: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = { Patient };
