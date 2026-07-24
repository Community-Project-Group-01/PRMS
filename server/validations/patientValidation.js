const Joi = require("joi");
const { email, contact, nic, password } = require("./common");

// `role` is intentionally not accepted here - it is set server-side, never trusted from the client.
const registerPatientSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: email().required(),
    nic: nic().required(),
    patientType: Joi.string().valid("student", "public", "staff").required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    allergies: Joi.array().items(Joi.string().trim().max(100)).max(50).default([]),
    contact: contact().required(),
    address: Joi.string().trim().min(5).max(200).required(),
    dob: Joi.date().max("now").required(),
    age: Joi.number().integer().min(0).max(150).required(),
});

const updatePatientSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    email: email(),
    contact: contact(),
    address: Joi.string().trim().min(5).max(200),
    password: password(),
}).min(1);

module.exports = { registerPatientSchema, updatePatientSchema };
