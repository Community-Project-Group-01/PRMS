const jwt = require("jsonwebtoken")

const generateToken = (userId, res) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15 * 24 * 60 * 60 * 1000,
        });
    } catch (error) {
        const logger = require("./logger");
        logger.error("Error in generateToken", { error: error.message, stack: error.stack });
    }
}

module.exports = { generateToken }