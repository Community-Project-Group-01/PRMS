const express = require("express");
const { protectedRoutes } = require("../middleware/protectedRoutes");
const { auditMiddleware } = require("../middleware/auditMiddleware");
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
  createMedicalRecord,
  auditMiddleware("CREATED_MEDICAL_RECORD")
);
medicalRecordRouter.get("/patient/:id", protectedRoutes, getRecordsByPatient);
medicalRecordRouter.get("/record/:id", protectedRoutes, getRecordById);
medicalRecordRouter.get("/report", protectedRoutes, getRecordsByDoctor);

module.exports = { medicalRecordRouter };
