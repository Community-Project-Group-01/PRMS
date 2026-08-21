const { Prescription } = require("../models/Prescription");
const { Doctor } = require("../models/Doctor");
const logger = require("../utils/logger");

const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { id: patientId } = req.params;
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = 10;
    const filter = {
      patient: patientId,
      isDeleted: false,
    };
    const [prescriptions, total] = await Promise.all([
      Prescription.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({path: "doctor", populate: {path : "user"}})
      .populate({path: "patient", populate: {path : "user"}})
      .populate("medicalRecord", "_id createdAt"),
      Prescription.countDocuments(filter),
    ]);
    if (prescriptions.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No prescriptions Available." });
    }
    return res.status(201).json({
      success: true,
      message: "Available prescriptions",
      data: prescriptions,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    logger.error("Get Prescription Error", { error: error.message, stack: error.stack });
    return res
      .status(500)
      .json({ message: "Server error fetching prescriptions." });
  }
};

const getPrescriptionById = async (req, res) => {
  try {
    const { id: prescriptionId } = req.params;
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res
        .status(404)
        .json({ success: false, message: "No prescription Available." });
    }
    return res.status(201).json({
      success: true,
      message: "Available prescription",
      data: prescription,
    });
  } catch (error) {
    logger.error("Get Prescription by Id Error", { error: error.message, stack: error.stack });
    return res
      .status(500)
      .json({ message: "Server error fetching prescriptions." });
  }
};

// Soft delete prescription (Admin/Doctor only)
const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found." });
    }

    return res.json({
      message: "Prescription deleted successfully (soft delete).",
    });
  } catch (error) {
    logger.error("Delete Prescription Error", { error: error.message, stack: error.stack });
    return res
      .status(500)
      .json({ message: "Server error deleting prescription." });
  }
};
// get prescriptions by doctor
const getPrescriptionsByDoctor = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found." });
    }
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = 10;
    const filter = { doctor: doctor._id, isDeleted: false };
    const [myPrescriptions, total] = await Promise.all([
      Prescription.find(filter).skip((page - 1) * limit).limit(limit),
      Prescription.countDocuments(filter),
    ]);
    if (myPrescriptions.length == 0) {
      return res
        .status(200)
        .json({ success: true, message: "No Prsecription Available." });
    }

    return res.status(200).json({
      success: true,
      data: myPrescriptions,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    logger.error("getPrescriptionsByDoctor Error", { error: error.message, stack: error.stack });
    return res
      .status(500)
      .json({ message: "Server error getPrescriptionsByDoctor." });
  }
};

module.exports = {
  deletePrescription,
  getPrescriptionById,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
};
