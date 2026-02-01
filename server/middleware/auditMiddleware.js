const { AuditLog } = require("../models/AuditLog");
const { sanitizeLog } = require("../utils/sanitizeLog");

const auditMiddleware = (action) => {
    return async (req, res, next) => {
        try {
            if (req.user) {
                const cleanBody = sanitizeLog(req.body)
                await AuditLog.create({
                    user: req.user._id,
                    role: req.user.role,
                    action: action,
                    details: JSON.stringify(cleanBody || {}),
                    ipAddress: req.ip,
                    userAgent: req.headers["user-agent"],
                });
            }
        } catch (error) {
            const logger = require("../utils/logger");
            logger.error("Audit Logging Error", { error: error.message, stack: error.stack });
        }
        next();
    };
};

module.exports = { auditMiddleware };
