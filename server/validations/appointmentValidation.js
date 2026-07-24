const Joi = require("joi");
const { objectId } = require("./common");

const createAppointmentSchema = Joi.object({
    doctorId: objectId().required(),
    patientId: objectId().required(),
});

const updateAppointmentSchema = Joi.object({
    id: objectId().required(),
    status: Joi.string().valid("Queue", "Consultation", "Closed").required(),
});

module.exports = { createAppointmentSchema, updateAppointmentSchema };
