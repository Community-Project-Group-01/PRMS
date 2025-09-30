const jwt = require("jsonwebtoken")
const { User } = require("../models/User")

const protectedRoutes = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorised Access" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Token Invalid" })
        }
        const user = await User.findById(decoded.userId).select("-password")
        if (!user) {
            return res.status(404).json({ success: false, message: "No user found" })
        }
        req.user = user
        next()
    } catch (error) {
        console.error(`Error in protectedRoutes: ${error.message}`);
    }
}

module.exports = { protectedRoutes }