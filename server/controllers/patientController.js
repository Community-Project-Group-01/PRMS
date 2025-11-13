const bcrypt = require("bcrypt");
const { emailValidator, validateSriLankanNIC, mobileNumberValidator } = require("../utils/validator");
const { User } = require("../models/User");
const { Patient } = require("../models/Patient");
const { generatePassword } = require("../utils/generatePassword");
const { generateToken } = require("../utils/generateToken");
const { sendMail } = require("../utils/mailer");
const mongoose = require("mongoose");

const registerPatient = async (req, res) => {
    try {
        const {
            name,
            email,
            role,
            nic,
            patientType,
            allergies,
            contact,
            address,
            dob,
            age,
            gender,
        } = req.body;

        // Validate required fields
        if (!name || !email || !role || !nic || !contact || !gender || !age) {
            return res.status(400).json({ success: false, message: "All required fields must be provided" });
        }

        // Email validation
        if (!emailValidator(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // NIC validation
        if (!validateSriLankanNIC(nic)) {
            return res.status(400).json({ success: false, message: "Invalid NIC format" });
        }

        // Mobile number validation
        if (!mobileNumberValidator(contact)) {
            return res.status(400).json({ success: false, message: "Invalid contact number" });
        }

        // Check if email or NIC already exists
        const existingPatient = await User.findOne({ $or: [{ email }, { nic }] });
        if (existingPatient) {
            return res.status(409).json({ success: false, message: "Email or NIC already registered" });
        }

        // // Generate and hash password
        // const plainPassword = await generatePassword(name, nic, email);

        // const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // Create user
        const newUser = new User({
            name,
            email,
            password: "none",
            role,
        });
        await newUser.save();

        // Create patient
        const newPatient = new Patient({
            nic,
            user: newUser._id,
            patientType,
            allergies,
            contact,
            address,
            dob,
        });
        await newPatient.save();

        //         // Send email with plain password
        //         await sendMail(email, "Your Account Credentials", `
        //       Hi ${name},

        //       Your patient account has been created successfully.

        //     Email: ${email}
        // Password: ${plainPassword}

        //       Please keep your password safe.
        //     `);

        // Respond
        return res.status(201).json({
            success: true,
            message: "Patient registered successfully, credentials sent via email",
            data: {
                id: newPatient._id,
                name,
                email,
                nic,
                contact,
                patientType,
            },
        });
    } catch (error) {
        console.error("Error in registerPatient:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
const updatePatient = async (req, res) => {
    try {
        const patientId = req.user._id.toString();

        const {
            name,
            email,
            contact,
            address,
            password
        } = req.body;

        // Check if patient exists
        const patient = await Patient.findOne({ user: patientId }).populate("user");

        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }


        // Email validation
        if (email && !emailValidator(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // Mobile number validation
        if (contact && !mobileNumberValidator(contact)) {
            return res.status(400).json({ success: false, message: "Invalid contact number" });
        }


        // Email uniqueness check
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: patient.user._id } });
            if (existingUser) {
                return res.status(409).json({ success: false, message: "Email already registered" });
            }
        }

        // === Update User fields ===
        if (name) patient.user.name = name;
        if (email) patient.user.email = email;

        // Update password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            patient.user.password = hashedPassword;
        }

        await patient.user.save();

        // === Update Patient fields ===
        if (contact) patient.contact = contact;
        if (address) patient.address = address;

        await patient.save();

        return res.status(200).json({
            success: true,
            message: "Patient updated successfully",
            data: {
                user: {
                    id: patient.user._id,
                    name: patient.user.name,
                    email: patient.user.email,

                },
                patient: {
                    id: patient._id,
                    contact: patient.contact,
                    address: patient.address
                }
            }
        });
    } catch (error) {
        console.error("Error in updatePatient:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const getAllPatients = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const patients = await Patient.find()
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate({ path: "user", select: "-password -__v" });

        return res.status(200).json({
            success: true,
            message: "Patients fetched successfully",
            data: patients
        });
    } catch (error) {
        console.error("Error in getAllPatients:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid patient ID" });
        }

        const patient = await Patient.findById(id).populate({
            path: "user",
            select: "-password -__v"
        });

        if (!patient) {
            return res.status(404).json({ success: false, message: "No patient found" });
        }

        return res.status(200).json({
            success: true,
            message: "Patient fetched successfully",
            data: patient
        });
    } catch (error) {
        console.error("Error in getPatientById:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = { registerPatient, getAllPatients, getPatientById, updatePatient };

