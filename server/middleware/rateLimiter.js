const rateLimit = require("express-rate-limit");

// Tight limit on login: slows down brute-force/credential-stuffing attempts.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts. Please try again in 15 minutes.",
    },
});

// Tight limit on forgot/reset password: prevents email-bombing and token-guessing.
const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many password reset requests. Please try again later.",
    },
});

// Baseline limit for the rest of the API.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please slow down.",
    },
});

module.exports = { authLimiter, passwordResetLimiter, apiLimiter };
