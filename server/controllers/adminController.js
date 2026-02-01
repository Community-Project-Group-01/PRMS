const { User } = require("../models/User");
const { Patient } = require("../models/Patient");
const { Doctor } = require("../models/Doctor");
const { MedicalRecord } = require("../models/MedicalRecord");
const { Prescription } = require("../models/Prescription");

const getAdminStats = async (req, res) => {
  try {
    // Get total counts
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalMedicalRecords = await MedicalRecord.countDocuments({
      isDeleted: false,
    });
    const totalPrescriptions = await Prescription.countDocuments({
      isDeleted: false,
    });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPatients = await Patient.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const recentMedicalRecords = await MedicalRecord.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      isDeleted: false,
    });

    // Get patient type distribution
    const patientTypeStats = await Patient.aggregate([
      {
        $group: {
          _id: "$patientType",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get doctor specialization distribution
    const specializationStats = await Doctor.aggregate([
      {
        $group: {
          _id: "$specialization",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get monthly medical records for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRecords = await MedicalRecord.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Get recent medical records with patient and doctor info
    const recentRecords = await MedicalRecord.find({ isDeleted: false })
      .populate({
        path: "patient",
        select: "nic patientType",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate({
        path: "doctor",
        select: "specialization",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totals: {
          patients: totalPatients,
          doctors: totalDoctors,
          medicalRecords: totalMedicalRecords,
          prescriptions: totalPrescriptions,
        },
        recent: {
          newPatients: recentPatients,
          newMedicalRecords: recentMedicalRecords,
        },
        distributions: {
          patientTypes: patientTypeStats,
          specializations: specializationStats,
        },
        charts: {
          monthlyRecords: monthlyRecords,
        },
        recentActivity: recentRecords,
      },
    });
  } catch (error) {
    const logger = require("../utils/logger");
    logger.error("Error fetching admin stats", { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { getAdminStats };
