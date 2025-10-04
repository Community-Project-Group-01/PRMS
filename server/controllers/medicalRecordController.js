const mongoose = require("mongoose");
const { User } = require("../models/User");
const { MedicalRecord } = require("../models/MedicalRecord");
const { Prescription } = require("../models/Prescription");
const { Doctor } = require("../models/Doctor");
const { Patient } = require("../models/Patient");

/**
 * Create a medical record with  prescriptions
 */
const createMedicalRecord = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const doctorId = req.user._id;
        const { id: patientId } = req.params;
        const { soap, prescriptions = [], vitals, notes } = req.body;

        const doctor = await Doctor.findOne({ user: doctorId }).select("-password")
        const patient = await Patient.findById(patientId).select("-password")

        // Basic validation
        if (
            !patient ||
            !doctor ||
            !soap ||
            !soap.subjective ||
            !soap.objective ||
            !soap.assessment ||
            !soap.plan
        ) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message:
                    "Missing required fields for medical record (patient, doctor, full SOAP required).",
            });
        }

        // Create medical record first
        const recordDoc = {
            patient: patientId,
            doctor: doctor._id,
            soap,
            vitals,
            notes,
        };

        const createdRecords = await MedicalRecord.create([recordDoc], { session });
        const medicalRecord = createdRecords[0];

        // Prescription handling
        let prescriptionDoc = null;

        if (prescriptions.length > 0) {
            const items = [];

            for (const p of prescriptions) {
                if (!p.drug || !p.dosage || !p.duration) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({
                        success: false,
                        message:
                            "Prescription items must include drug, dosage and duration.",
                    });
                }

                items.push({
                    drug: p.drug,
                    dosage: p.dosage,
                    instructions: p.instructions || "",
                    duration: p.duration,
                });
            }

            // Create prescription linked to record
            prescriptionDoc = await Prescription.create(
                [
                    {
                        patient: patientId,
                        doctor: doctor._id,
                        medicalRecord: medicalRecord._id,
                        items,
                    },
                ],
                { session }
            );
        }

        // Link prescription to medical record
        if (prescriptionDoc) {
            medicalRecord.prescriptions = [prescriptionDoc[0]._id];
            await medicalRecord.save({ session });
        }

        // Commit transaction
        await session.commitTransaction();
        session.endSession();


        // Populate response
        const populated = await MedicalRecord.findById(medicalRecord._id)
            .populate({ path: "doctor" })
            .populate({ path: "patient" })
            .populate({ path: "prescriptions" });

        next()

        return res.status(201).json({
            success: true,
            message: "Medical record created",
            data: populated
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Create Prescription Error:", error.message);
        return res.status(500).json({ message: "Server error creating prescription." })
    }
};


/**
 * Get medical records by patient with pagination and optional date-filter or last30 param
 * Query params:
 *   page (default 1), limit (default 20), last30 (boolean), from, to
 */
const getRecordsByPatient = async (req, res) => {
    try {
        const { id: patientId } = req.params;
        const page = Math.max(1, parseInt(req.query.page || "1", 10));
        const limit = Math.min(100, parseInt(req.query.limit || "20", 10));
        const last30 = req.query.last30 === "true" || req.query.last30 === "1";
        const from = req.query.from ? new Date(req.query.from) : null;
        const to = req.query.to ? new Date(req.query.to) : null;

        const filter = { patient: patientId, isDeleted: false };

        if (last30) {
            const since = new Date();
            since.setDate(since.getDate() - 30);
            filter.createdAt = { $gte: since };
        } else if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = from;
            if (to) filter.createdAt.$lte = to;
        }

        const total = await MedicalRecord.countDocuments(filter);
        const records = await MedicalRecord.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({ path: "doctor" })
            .populate({ path: "prescriptions" });

        return res.json({
            success: true,
            message: "Data successfully Fetched",
            meta: { page, limit, total, pages: Math.ceil(total / limit) },
            data: records,
        });
    } catch (err) {
        console.error("Error fetching records for patient: " + err.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * Get single medical record by id
 */
const getRecordById = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await MedicalRecord.findOne({ _id: id, isDeleted: false })
            .populate({ path: "doctor" })
            .populate({ path: "patient" })
            .populate({ path: "prescriptions" });

        if (!record) return res.status(404).json({ success: false, message: "Medical record not found" });
        return res.json({ success: true, data: record });
    } catch (err) {
        console.error("Error fetching medical record: " + err.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * Update medical record (partial updates). Only certain fields allowed to change.
 * This does NOT re-run prescription/inventory logic. For prescription edits, use prescription-specific endpoints.
 */
const updateRecord = async (req, res) => {
    try {
        const allowed = ["soap", "vitals", "notes"];
        const updates = {};
        for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No updatable fields provided" });
        }

        const record = await MedicalRecord.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { $set: updates },
            { new: true }
        ).populate({ path: "doctor" });

        if (!record) return res.status(404).json({ success: false, message: "Medical record not found or deleted" });


        return res.json({ success: true, message: "Medical record updated", data: record });
    } catch (err) {
        console.error("Error updating medical record: " + err.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * Soft delete a medical record
 */
const softDeleteRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { $set: { isDeleted: true } },
            { new: true }
        );
        if (!record) return res.status(404).json({ success: false, message: "Medical record not found" });

        return res.json({ success: true, message: "Medical record soft-deleted" });
    } catch (err) {
        console.error("Error deleting medical record: " + err.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { createMedicalRecord, updateRecord, getRecordById, getRecordsByPatient, softDeleteRecord }

