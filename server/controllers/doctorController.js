const bcrypt = require("bcrypt");
const { emailValidator, mobileNumberValidator } = require("../utils/validator");
const { User } = require("../models/User");
const { generatePassword } = require("../utils/generatePassword");
const { sendMail } = require("../utils/mailer");
const mongoose = require("mongoose");
const { Doctor } = require("../models/Doctor");

const registerDoctor = async (req, res) => {
    try {
        const {
            name,
            email,
            role,
            specialization,
            licenseNumber,
            yearsOfExperience,
            contact
        } = req.body;

        // Validate required fields
        if (!name || !email || !role || !specialization || !contact || !licenseNumber || !yearsOfExperience) {
            return res.status(400).json({ success: false, message: "All required fields must be provided" });
        }

        // licenseNumber validation
        if (!emailValidator(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // licenseNumber validation
        // <-------------- Need to write logic -------------->

        // Mobile number validation
        if (!mobileNumberValidator(contact)) {
            return res.status(400).json({ success: false, message: "Invalid contact number" });
        }

        // Check if email or NIC already exists
        const existingDoctor = await User.findOne({ $or: [{ email }, { licenseNumber }] });
        if (existingDoctor) {
            return res.status(409).json({ success: false, message: "Email or licenseNumber already registered" });
        }

        // Generate and hash password
        const plainPassword = await generatePassword(name, licenseNumber, email);

        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
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

        // Send email with plain password
        await sendMail(email, "Your Account Credentials", `
      Hi ${name},
      
      Your Doctor account has been created successfully.

    Email: ${email}
Password: ${plainPassword}
      
      Please keep your password safe.
    `);

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
        console.error("Error in registerDoctor:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const updateDoctor = async (req, res) => {
    try {
        const doctorId = req.user._id.toString();
        console.log(doctorId);

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
        console.log("sr", doctor);

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // Email validation
        if (email && !emailValidator(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // Mobile number validation
        if (contact && !mobileNumberValidator(contact)) {
            return res.status(400).json({ success: false, message: "Invalid contact number" });
        }

        // License number uniqueness check
        if (licenseNumber) {
            const existingLicense = await Doctor.findOne({ licenseNumber, _id: { $ne: doctorId } });
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
        console.error("Error in updateDoctor:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


const getAllDoctors = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const doctors = await Doctor.find()
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate({ path: "user", select: "-password -__v" });

        return res.status(200).json({
            success: true,
            message: "Doctors fetched successfully",
            data: doctors
        });
    } catch (error) {
        console.error("Error in getAllDoctors:", error.message);
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
        console.error("Error in getDoctorById:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = { registerDoctor, getAllDoctors, getDoctorById, updateDoctor };

