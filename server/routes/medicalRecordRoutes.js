const express = require("express");
const { protectedRoutes } = require("../middleware/protectedRoutes");
const { authorize } = require("../middleware/authorize");
const { auditMiddleware } = require("../middleware/auditMiddleware");
const { validate } = require("../middleware/validate");
const { objectIdParams } = require("../validations/common");
const { createMedicalRecordSchema } = require("../validations/medicalRecordValidation");
const {
  createMedicalRecord,
  getRecordsByPatient,
  getRecordById,
  getRecordsByDoctor,
} = require("../controllers/medicalRecordController");

const medicalRecordRouter = express.Router();

medicalRecordRouter.post(
  "/add/:id",
  protectedRoutes,
  authorize("doctor"),
  validate(objectIdParams("id"), "params"),
  validate(createMedicalRecordSchema),
  createMedicalRecord,
  auditMiddleware("CREATED_MEDICAL_RECORD")
);
medicalRecordRouter.get(
  "/patient/:id",
  protectedRoutes,
  authorize("admin", "doctor"),
  validate(objectIdParams("id"), "params"),
  getRecordsByPatient
);
medicalRecordRouter.get(
  "/record/:id",
  protectedRoutes,
  authorize("admin", "doctor"),
  validate(objectIdParams("id"), "params"),
  getRecordById
);
medicalRecordRouter.get("/report", protectedRoutes, authorize("doctor"), getRecordsByDoctor);

module.exports = { medicalRecordRouter };
