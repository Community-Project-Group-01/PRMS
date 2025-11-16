const { Prescription } = require("../models/Prescription");

const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { id: patientId } = req.params;
    const prescriptions = await Prescription.find({
      patient: patientId,
      isDeleted: false,
    })
      .populate("doctor")
      .populate("patient")
      .populate("medicalRecord", "_id createdAt");
    if (prescriptions.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No prescriptions Available." });
    }
    return res.status(201).json({
      success: true,
      message: "Available prescriptions",
      data: prescriptions,
    });
  } catch (error) {
    console.error("Get Prescription Error:", error.message);
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
    console.error("Get Prescription by Id Error:", error.message);
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
    console.error("Delete Prescription Error:", error.message);
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
    const myPrescriptions = await Prescription.find({ doctor: doctor._id });
    if (myPrescriptions.length == 0) {
      return res
        .status(200)
        .json({ success: true, message: "No Prsecription Available." });
    }

    return res.status(200).json({ success: true, data: myPrescriptions });
  } catch (error) {
    console.error("getPrescriptionsByDoctor Error:", error.message);
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
