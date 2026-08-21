const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { generatePassword } = require("../utils/generatePassword");
const { sendCredentialsEmail } = require("../utils/emailService");
const logger = require("../utils/logger");
const mongoose = require("mongoose");
const { Doctor } = require("../models/Doctor");
const Appointment = require("../models/Appoinment");

// Builds a contiguous array of "YYYY-MM-DD" dates from `start` to today (inclusive)
// and fills in 0 for any date missing from the aggregation results.
const fillDailySeries = (aggregateResults, start) => {
    const countsByDate = new Map(aggregateResults.map((r) => [r._id, r.count]));
    const series = [];
    const cursor = new Date(start);
    cursor.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (cursor <= today) {
        const key = cursor.toISOString().slice(0, 10);
        series.push({ date: key, count: countsByDate.get(key) || 0 });
        cursor.setDate(cursor.getDate() + 1);
    }
    return series;
};

const registerDoctor = async (req, res) => {
    try {
        const {
            name,
            email,
            specialization,
            licenseNumber,
            yearsOfExperience,
            contact
        } = req.body;

        // Check if email or NIC already exists
        const existingDoctor = await User.findOne({ $or: [{ email }, { licenseNumber }] });
        if (existingDoctor) {
            return res.status(409).json({ success: false, message: "Email or licenseNumber already registered" });
        }

        // Generate and hash password
        const plainPassword = await generatePassword(name, licenseNumber, email);

        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // Create user - role is always "doctor" here, never taken from the request body
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: "doctor",
        });
        await newUser.save();

        // Create doctor
        const newDoctor = new Doctor({
            user: newUser._id,
            specialization,
            licenseNumber,
            yearsOfExperience,
            contact
        });
        await newDoctor.save();

        // Send email with plain password using SendGrid
        await sendCredentialsEmail(email, name, email, plainPassword, "doctor");
        logger.info("Doctor registered and credentials email sent", { doctorId: newDoctor._id, email });

        // Respond
        return res.status(201).json({
            success: true,
            message: "Doctor registered successfully, credentials sent via email",
            data: {
                id: newDoctor._id,
                name,
                email,
                specialization,
                licenseNumber,
                yearsOfExperience,
                contact
            },
        });
    } catch (error) {
        logger.error("Error in registerDoctor", { error: error.message, stack: error.stack });
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const updateDoctor = async (req, res) => {
    try {
        const doctorId = req.user._id.toString();

        const {
            name,
            email,
            specialization,
            licenseNumber,
            yearsOfExperience,
            password,
            contact
        } = req.body;

        // Check if doctor exists
        const doctor = await Doctor.findOne({ user: doctorId }).populate("user");

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // License number uniqueness check
        if (licenseNumber) {
            const existingLicense = await Doctor.findOne({ licenseNumber, _id: { $ne: doctor._id } });
            if (existingLicense) {
                return res.status(409).json({ success: false, message: "License number already registered" });
            }
        }

        // Email uniqueness check
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: doctor.user._id } });
            if (existingUser) {
                return res.status(409).json({ success: false, message: "Email already registered" });
            }
        }

        // === Update User fields ===
        if (name) doctor.user.name = name;
        if (email) doctor.user.email = email;

        // Update password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            doctor.user.password = hashedPassword;
        }

        await doctor.user.save();

        // === Update Doctor fields ===
        if (specialization) doctor.specialization = specialization;
        if (licenseNumber) doctor.licenseNumber = licenseNumber;
        if (yearsOfExperience) doctor.yearsOfExperience = yearsOfExperience;
        if (contact) doctor.contact = contact;

        await doctor.save();

        return res.status(200).json({
            success: true,
            message: "Doctor updated successfully",
            data: {
                user: {
                    id: doctor.user._id,
                    name: doctor.user.name,
                    email: doctor.user.email,
                },
                doctor: {
                    id: doctor._id,
                    specialization: doctor.specialization,
                    licenseNumber: doctor.licenseNumber,
                    yearsOfExperience: doctor.yearsOfExperience,
                    contact: doctor.contact,
                }
            }
        });
    } catch (error) {
        logger.error("Error in updateDoctor", { error: error.message, stack: error.stack });
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


const getAllDoctors = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page || "1", 10));
        const limit = 10;

        const [doctors, total] = await Promise.all([
            Doctor.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({ path: "user", select: "-password -__v" }),
            Doctor.countDocuments(),
        ]);

        return res.status(200).json({
            success: true,
            message: "Doctors fetched successfully",
            data: doctors,
            meta: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        logger.error("Error in getAllDoctors", { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid doctor ID" });
        }

        const doctor = await Doctor.findById(id).populate({
            path: "user",
            select: "-password -__v"
        });

        if (!doctor) {
            return res.status(404).json({ success: false, message: "No doctor found" });
        }

        return res.status(200).json({
            success: true,
            message: "Doctor fetched successfully",
            data: doctor
        });
    } catch (error) {
        logger.error("Error in getDoctorById", { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get stats for the logged-in doctor's own dashboard
const getDoctorStats = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user._id }).populate({
            path: "user",
            select: "name",
        });
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        tenDaysAgo.setHours(0, 0, 0, 0);

        const [
            queueCount,
            consultationCount,
            closedLast10DaysCount,
            totalAppointments,
            uniquePatientIds,
            last30DaysRaw,
            closedLast10DaysRaw,
            statusBreakdown,
            patientTypeBreakdown,
        ] = await Promise.all([
            Appointment.countDocuments({ doctor: doctor._id, status: "Queue" }),
            Appointment.countDocuments({ doctor: doctor._id, status: "Consultation" }),
            Appointment.countDocuments({
                doctor: doctor._id,
                status: "Closed",
                updatedAt: { $gte: tenDaysAgo },
            }),
            Appointment.countDocuments({ doctor: doctor._id }),
            Appointment.distinct("patient", { doctor: doctor._id }),
            Appointment.aggregate([
                { $match: { doctor: doctor._id, createdAt: { $gte: thirtyDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 },
                    },
                },
            ]),
            Appointment.aggregate([
                {
                    $match: {
                        doctor: doctor._id,
                        status: "Closed",
                        updatedAt: { $gte: tenDaysAgo },
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                        count: { $sum: 1 },
                    },
                },
            ]),
            Appointment.aggregate([
                { $match: { doctor: doctor._id } },
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]),
            Appointment.aggregate([
                { $match: { doctor: doctor._id } },
                { $group: { _id: "$patient" } },
                {
                    $lookup: {
                        from: "patients",
                        localField: "_id",
                        foreignField: "_id",
                        as: "patientInfo",
                    },
                },
                { $unwind: "$patientInfo" },
                { $group: { _id: "$patientInfo.patientType", count: { $sum: 1 } } },
            ]),
        ]);

        res.status(200).json({
            success: true,
            data: {
                doctor: {
                    name: doctor.user?.name,
                    specialization: doctor.specialization,
                },
                counts: {
                    queue: queueCount,
                    consultation: consultationCount,
                    closedLast10Days: closedLast10DaysCount,
                    totalAppointments,
                    totalPatients: uniquePatientIds.length,
                },
                charts: {
                    last30Days: fillDailySeries(last30DaysRaw, thirtyDaysAgo),
                    closedLast10Days: fillDailySeries(closedLast10DaysRaw, tenDaysAgo),
                    statusBreakdown,
                    patientTypeBreakdown,
                },
            },
        });
    } catch (error) {
        logger.error("Error fetching doctor stats", { error: error.message, stack: error.stack });
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { registerDoctor, getAllDoctors, getDoctorById, updateDoctor, getDoctorStats };

