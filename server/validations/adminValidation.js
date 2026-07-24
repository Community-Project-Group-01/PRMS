const Joi = require("joi");
const { email, password } = require("./common");

const updateAdminSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    email: email(),
    password: password(),
}).min(1);

module.exports = { updateAdminSchema };
