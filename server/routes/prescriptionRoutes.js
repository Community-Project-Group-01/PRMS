const express = require("express");
const { protectedRoutes } = require("../middleware/protectedRoutes");
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
  getPrescriptionsByPatient
);
prescriptionRouter.get("/:id", protectedRoutes, getPrescriptionById);
prescriptionRouter.delete("/:id", protectedRoutes, deletePrescription);
prescriptionRouter.get("/get", protectedRoutes, getPrescriptionsByDoctor);

module.exports = { prescriptionRouter };
