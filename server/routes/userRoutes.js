const express = require('express');
const { loginUser, logout, authMe } = require('../controllers/authController');
const { protectedRoutes } = require('../middleware/protectedRoutes');

const userRouter = express.Router();

userRouter.post('/login', loginUser)
userRouter.post('/logout', protectedRoutes, logout)
userRouter.get('/auth-me', protectedRoutes, authMe)

module.exports = { userRouter }
