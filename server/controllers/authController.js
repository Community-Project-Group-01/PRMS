const { User } = require("../models/User")
const bcrypt = require("bcrypt")
const { generateToken } = require("../utils/generateToken")


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
        return res.status(200).json({ success: true, message: "Login successfull" })
    } catch (error) {
        console.error("Error in loginUser:", error.message);
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

        res.status(200).json({ message: "Logout Successful" });
    } catch (error) {
        console.log(`Error in Logout Controller: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const authMe = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ success: false, message: "Not Authorised" })
        }
        return res.status(200).json({ success: true, message: "User Authentication success", data: user })
    } catch (error) {
        console.error(`Error in authMe Controller: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
module.exports = { loginUser, logout, authMe }