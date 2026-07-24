const Joi = require("joi");

// Bounds every field that ends up in AuditLog.details and on the doctor-facing
// prescription PDF/UI, so an oversized or malformed value is rejected here
// instead of reaching those surfaces.
const prescriptionItemSchema = Joi.object({
    drug: Joi.string().trim().min(1).max(150).required(),
    dosage: Joi.string().trim().min(1).max(150).required(),
    duration: Joi.string().trim().min(1).max(100).required(),
    instructions: Joi.string().trim().max(500).allow("").default(""),
});

const vitalsSchema = Joi.object({
    temperature: Joi.number().min(20).max(45).empty("").optional(),
    bloodPressure: Joi.string().trim().max(20).empty("").optional(),
    pulse: Joi.number().integer().min(0).max(300).empty("").optional(),
    respiration: Joi.number().integer().min(0).max(120).empty("").optional(),
});

const soapSchema = Joi.object({
    subjective: Joi.string().trim().min(1).max(2000).required(),
    objective: Joi.string().trim().min(1).max(2000).required(),
    assessment: Joi.string().trim().min(1).max(2000).required(),
    plan: Joi.string().trim().min(1).max(2000).required(),
});

const createMedicalRecordSchema = Joi.object({
    soap: soapSchema.required(),
    vitals: vitalsSchema.optional(),
    notes: Joi.string().trim().max(3000).allow("").optional(),
    prescriptions: Joi.array().items(prescriptionItemSchema).max(30).default([]),
});

module.exports = { createMedicalRecordSchema };
