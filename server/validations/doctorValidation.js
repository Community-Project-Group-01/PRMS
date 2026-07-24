const Joi = require("joi");
const { email, contact, password } = require("./common");

// `role` is intentionally not accepted here - it is set server-side, never trusted from the client.
const registerDoctorSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: email().required(),
    specialization: Joi.string().trim().min(2).max(100).required(),
    licenseNumber: Joi.string().trim().min(2).max(50).required(),
    yearsOfExperience: Joi.number().integer().min(0).max(60).required(),
    contact: contact().required(),
});

const updateDoctorSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    email: email(),
    specialization: Joi.string().trim().min(2).max(100),
    licenseNumber: Joi.string().trim().min(2).max(50),
    yearsOfExperience: Joi.number().integer().min(0).max(60),
    contact: contact(),
    password: password(),
}).min(1);

module.exports = { registerDoctorSchema, updateDoctorSchema };
