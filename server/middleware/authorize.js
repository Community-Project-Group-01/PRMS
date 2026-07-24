const logger = require("../utils/logger");

// Must run after protectedRoutes, which attaches req.user.
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorised Access" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            logger.warn("Forbidden access attempt", {
                userId: req.user._id,
                role: req.user.role,
                path: req.originalUrl,
                method: req.method,
                allowedRoles,
            });
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
            });
        }

        next();
    };
};

module.exports = { authorize };
