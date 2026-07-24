const express = require('express');
const { loginUser, logout, authMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protectedRoutes } = require('../middleware/protectedRoutes');
const { validate } = require('../middleware/validate');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const { loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validations/authValidation');

const userRouter = express.Router();

userRouter.post('/login', authLimiter, validate(loginSchema), loginUser)
userRouter.post('/logout', protectedRoutes, logout)
userRouter.get('/auth-me', protectedRoutes, authMe)
userRouter.post('/forgot-password', passwordResetLimiter, validate(forgotPasswordSchema), forgotPassword)
userRouter.post('/reset-password', passwordResetLimiter, validate(resetPasswordSchema), resetPassword)

module.exports = { userRouter }
