const express = require("express");
const { protectedRoutes } = require("../middleware/protectedRoutes");
const { authorize } = require("../middleware/authorize");
const { validate } = require("../middleware/validate");
const { objectIdParams } = require("../validations/common");
const {
  getPrescriptionsByPatient,
  getPrescriptionById,
  deletePrescription,
  getPrescriptionsByDoctor,
} = require("../controllers/prescriptionController");

const prescriptionRouter = express.Router();

prescriptionRouter.get(
  "/patient/:id",
  protectedRoutes,
  authorize("admin", "doctor"),
  validate(objectIdParams("id"), "params"),
  getPrescriptionsByPatient
);
// Must come before "/:id" - otherwise Express would match "get" as an :id value.
prescriptionRouter.get("/get", protectedRoutes, authorize("doctor"), getPrescriptionsByDoctor);
prescriptionRouter.get(
  "/:id",
  protectedRoutes,
  authorize("admin", "doctor"),
  validate(objectIdParams("id"), "params"),
  getPrescriptionById
);
prescriptionRouter.delete(
  "/:id",
  protectedRoutes,
  authorize("admin", "doctor"),
  validate(objectIdParams("id"), "params"),
  deletePrescription
);

module.exports = { prescriptionRouter };
