const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        specialization: {
            type: String,
            required: true,
        },
        licenseNumber: {
            type: String,
            required: true,
            unique: true,
        },
        yearsOfExperience: {
            type: Number,
            default: 0,
        },
        contact: {
            type: String,
            default: "",
        },
        isAvailable: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = { Doctor }
