const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { Patient } = require("../models/Patient");
const { Doctor } = require("../models/Doctor");
const { MedicalRecord } = require("../models/MedicalRecord");
const { Prescription } = require("../models/Prescription");
const Appointment = require("../models/Appoinment");
const { Inventory } = require("../models/Inventory");
const logger = require("../utils/logger");

const LOW_STOCK_THRESHOLD = 10;

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

    // Queue / consultation snapshot
    const [queueCount, consultationCount] = await Promise.all([
      Appointment.countDocuments({ status: "Queue" }),
      Appointment.countDocuments({ status: "Consultation" }),
    ]);

    const activeAppointments = await Appointment.find({
      status: { $in: ["Queue", "Consultation"] },
    })
      .populate({
        path: "patient",
        select: "nic patientType",
        populate: { path: "user", select: "name" },
      })
      .populate({
        path: "doctor",
        select: "specialization",
        populate: { path: "user", select: "name" },
      })
      .sort({ status: 1, createdAt: 1 })
      .limit(10);

    // Inventory stock alerts
    const [lowStockItems, outOfStockItems, lowStockCount, outOfStockCount] =
      await Promise.all([
        Inventory.find({
          stockLevel: { $gt: 0, $lte: LOW_STOCK_THRESHOLD },
        })
          .select("brandName genericName stockLevel inventoryType")
          .sort({ stockLevel: 1 })
          .limit(10),
        Inventory.find({ stockLevel: { $lte: 0 } })
          .select("brandName genericName stockLevel inventoryType")
          .sort({ updatedAt: -1 })
          .limit(10),
        Inventory.countDocuments({
          stockLevel: { $gt: 0, $lte: LOW_STOCK_THRESHOLD },
        }),
        Inventory.countDocuments({ stockLevel: { $lte: 0 } }),
      ]);

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
        queue: {
          inQueue: queueCount,
          inConsultation: consultationCount,
          active: activeAppointments,
        },
        inventoryAlerts: {
          lowStockThreshold: LOW_STOCK_THRESHOLD,
          lowStockCount,
          outOfStockCount,
          lowStockItems,
          outOfStockItems,
        },
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

// Update the logged-in admin's own profile (name, email, password)
const updateAdmin = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { name, email, password } = req.body;

    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: admin._id } });
      if (existingUser) {
        return res.status(409).json({ success: false, message: "Email already registered" });
      }
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (password) admin.password = await bcrypt.hash(password, 10);

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    logger.error("Error in updateAdmin", { error: error.message, stack: error.stack });
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getAdminStats, updateAdmin };
