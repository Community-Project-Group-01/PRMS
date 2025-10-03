const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const soapSchema = new Schema({
    subjective: { type: String, required: true, trim: true },
    objective: { type: String, required: true, trim: true },
    assessment: { type: String, required: true, trim: true },
    plan: { type: String, required: true, trim: true },
}, { _id: false });

const medicalRecordSchema = new Schema(
    {
        patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
        soap: { type: soapSchema, required: true },
        prescriptions: [{ type: Schema.Types.ObjectId, ref: "Prescription" }],
        vitals: {
            temperature: { type: Number },
            bloodPressure: { type: String },
            pulse: { type: Number },
            respiration: { type: Number },
        },
        notes: { type: String, trim: true }, // free text notes
        isDeleted: { type: Boolean, default: false, index: true }, // soft delete
    },
    {
        timestamps: true,
        toJSON: { virtuals: true, versionKey: false },
        toObject: { virtuals: true, versionKey: false },
    }
);

// Compound index for faster queries by patient + createdAt
medicalRecordSchema.index({ patient: 1, createdAt: -1 });
medicalRecordSchema.index({ doctor: 1, createdAt: -1 });

/**
 * Virtual to show a short summary for listing
 */
medicalRecordSchema.virtual("summary").get(function () {
    const subj = this.soap?.subjective?.slice(0, 80) || "";
    const ass = this.soap?.assessment?.slice(0, 80) || "";
    return `${subj} — ${ass}`;
});

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
module.exports = { MedicalRecord };
