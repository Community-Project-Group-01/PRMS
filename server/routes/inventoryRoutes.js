const express = require("express");
const {
    createInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory,
} = require("../controllers/inventoryController");
const { protectedRoutes } = require("../middleware/protectedRoutes");
const { auditMiddleware } = require("../middleware/auditMiddleware");

const inventoryRouter = express.Router();

inventoryRouter.get("/", protectedRoutes, getAllInventory);
inventoryRouter.get("/:id", protectedRoutes, getInventoryById);
inventoryRouter.post("/", protectedRoutes, auditMiddleware("CREATE_INVENTORY"), createInventory);
inventoryRouter.put("/:id", protectedRoutes, auditMiddleware("UPDATE_INVENTORY"), updateInventory);
inventoryRouter.delete("/:id", protectedRoutes, auditMiddleware("DELETE_INVENTORY"), deleteInventory);

module.exports = { inventoryRouter };
