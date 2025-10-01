const express = require('express');
const { loginUser } = require('../controllers/authController');

const userRouter = express.Router();

userRouter.post('/login', loginUser)

module.exports = { userRouter }
