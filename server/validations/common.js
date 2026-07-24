const Joi = require("joi");
const {
    validateSriLankanNIC,
    passwordValidator,
    mobileNumberValidator,
} = require("../utils/validator");

const objectId = () =>
    Joi.string()
        .trim()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({ "string.pattern.base": "{{#label}} must be a valid ID" });

const email = () => Joi.string().trim().lowercase().email().max(150);

const password = () =>
    Joi.string()
        .custom((value, helpers) => {
            if (!passwordValidator(value)) return helpers.error("any.invalid");
            return value;
        })
        .messages({
            "any.invalid":
                "{{#label}} must be at least 8 characters and include a letter and a number",
        });

const contact = () =>
    Joi.string()
        .trim()
        .custom((value, helpers) => {
            if (!mobileNumberValidator(value)) return helpers.error("any.invalid");
            return value;
        })
        .messages({ "any.invalid": "{{#label}} must be a valid 10-digit contact number" });

const nic = () =>
    Joi.string()
        .trim()
        .custom((value, helpers) => {
            if (!validateSriLankanNIC(value)) return helpers.error("any.invalid");
            return value;
        })
        .messages({ "any.invalid": "{{#label}} must be a valid NIC" });

// Builds a Joi schema for validating route params, e.g. objectIdParams("id")
const objectIdParams = (...names) =>
    Joi.object(
        names.reduce((schema, name) => {
            schema[name] = objectId().required();
            return schema;
        }, {})
    );

module.exports = { objectId, email, password, contact, nic, objectIdParams };
