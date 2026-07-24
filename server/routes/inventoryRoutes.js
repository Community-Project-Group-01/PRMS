const express = require("express");
const {
    createInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory,
} = require("../controllers/inventoryController");
const { protectedRoutes } = require("../middleware/protectedRoutes");
const { authorize } = require("../middleware/authorize");
const { auditMiddleware } = require("../middleware/auditMiddleware");
const { validate } = require("../middleware/validate");
const { createInventorySchema, updateInventorySchema } = require("../validations/inventoryValidation");

const inventoryRouter = express.Router();

inventoryRouter.get("/", protectedRoutes, authorize("admin", "doctor"), getAllInventory);
inventoryRouter.get("/:id", protectedRoutes, authorize("admin", "doctor"), getInventoryById);
inventoryRouter.post(
  "/",
  protectedRoutes,
  authorize("admin"),
  validate(createInventorySchema),
  auditMiddleware("CREATE_INVENTORY"),
  createInventory
);
inventoryRouter.put(
  "/:id",
  protectedRoutes,
  authorize("admin"),
  validate(updateInventorySchema),
  auditMiddleware("UPDATE_INVENTORY"),
  updateInventory
);
inventoryRouter.delete("/:id", protectedRoutes, authorize("admin"), auditMiddleware("DELETE_INVENTORY"), deleteInventory);

module.exports = { inventoryRouter };
