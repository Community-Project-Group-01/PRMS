const { User } = require("../models/User")
const bcrypt = require("bcrypt")
const { generateToken } = require("../utils/generateToken")
const { Doctor } = require("../models/Doctor")
const { Patient } = require("../models/Patient")
const crypto = require("crypto")
const logger = require("../utils/logger")
const { sendPasswordResetEmail } = require("../utils/emailService")

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields Required" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: "No user found" })
        }
        const verifyPassword = await bcrypt.compare(password, user.password)
        if (!verifyPassword) {
            return res.status(401).json({ success: false, message: "Incorrect password" })
        }
        generateToken(user.id, res)
        logger.info("User logged in successfully", { userId: user._id, email: user.email, role: user.role })
        return res.status(200).json({
            success: true, message: "Login successfull", data: {
                email: user.email,
                name: user.name,
                role: user.role
            }
        })
    } catch (error) {
        logger.error("Error in loginUser", { error: error.message, stack: error.stack })
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/"
        });

        logger.info("User logged out", { userId: req.user?._id })
        res.status(200).json({ success: true, message: "Logout Successful" });
    } catch (error) {
        logger.error("Error in Logout Controller", { error: error.message, stack: error.stack })
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const authMe = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized",
            });
        }

        let userDetails;

        if (user.role === "doctor") {
            userDetails = await Doctor.findOne({ user: user._id }).select("-__v -_id -user");
        } else if (user.role === "patient") {
            userDetails = await Patient.findOne({ user: user._id }).select("-__v -_id -user");
        }

        const safeUser = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
        };

        return res.status(200).json({
            success: true,
            message: "User authentication successful",
            data: { ...safeUser, userDetails },
        });
    } catch (error) {
        logger.error("Error in authMe Controller", { error: error.message, stack: error.stack })
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

/**
 * Request password reset
 * Generates a reset token and sends it via email
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        // Don't reveal if user exists or not for security
        if (!user) {
            logger.warn("Password reset requested for non-existent email", { email });
            return res.status(200).json({
                success: true,
                message: "If an account with that email exists, a password reset link has been sent.",
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

        // Save reset token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Send reset email
        try {
            await sendPasswordResetEmail(user.email, user.name, resetToken);
            logger.info("Password reset email sent", { userId: user._id, email: user.email });
        } catch (emailError) {
            logger.error("Failed to send password reset email", {
                userId: user._id,
                email: user.email,
                error: emailError.message,
            });
            // Clear the token if email fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            return res.status(500).json({
                success: false,
                message: "Failed to send reset email. Please try again later.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "If an account with that email exists, a password reset link has been sent.",
        });
    } catch (error) {
        logger.error("Error in forgotPassword", { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * Reset password using token
 */
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Token and new password are required",
            });
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long",
            });
        }

        // Find user with valid reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        logger.info("Password reset successful", { userId: user._id, email: user.email });

        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully",
        });
    } catch (error) {
        logger.error("Error in resetPassword", { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = { loginUser, logout, authMe, forgotPassword, resetPassword }
