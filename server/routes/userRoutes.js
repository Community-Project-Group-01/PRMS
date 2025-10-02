const express = require('express');
const { loginUser, logout } = require('../controllers/authController');
const { protectedRoutes } = require('../middleware/protectedRoutes');

const userRouter = express.Router();

userRouter.post('/login', loginUser)
userRouter.post('/logout', protectedRoutes, logout)

module.exports = { userRouter }
