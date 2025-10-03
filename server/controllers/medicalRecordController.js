const mongoose = require("mongoose");
const { User } = require("../models/User");
const { MedicalRecord } = require("../models/MedicalRecord");
const { Prescription } = require("../models/Prescription");
const { Doctor } = require("../models/Doctor");
const { Patient } = require("../models/Patient");

/**
 * Create a medical record with  prescriptions
 */
const createMedicalRecord = async (req, res) => {
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


module.exports = { createMedicalRecord }
