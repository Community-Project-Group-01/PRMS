const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // who performed the action
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "doctor", "patient"],
            required: true,
        },
        action: {
            type: String,
            required: true, // e.g., "CREATE_PATIENT", "UPDATE_PROFILE", "PRESCRIBE_DRUG"
        },
        details: {
            type: String,
            default: "", // optional extra info like patient ID, prescription ID
        },
        ipAddress: {
            type: String,
        },
        userAgent: {
            type: String, // device/browser info
        },
    },
    { timestamps: true }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
module.exports = { AuditLog };
