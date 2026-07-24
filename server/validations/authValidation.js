const Joi = require("joi");
const { email, password } = require("./common");

const loginSchema = Joi.object({
    email: email().required(),
    password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
    email: email().required(),
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().trim().hex().length(64).required(),
    newPassword: password().required(),
});

module.exports = { loginSchema, forgotPasswordSchema, resetPasswordSchema };
