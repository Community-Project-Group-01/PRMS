const Joi = require("joi");

const text = (max = 100) => Joi.string().trim().min(1).max(max);

const INVENTORY_TYPES = ["Drug", "Medical Device", "Consumable", "Equipment", "Other"];

const createInventorySchema = Joi.object({
    genericName: text(150).required(),
    brandName: text(150).required(),
    dosage: text(100).required(),
    packSize: text(50).required(),
    packType: text(50).required(),
    manufacturer: text(150).required(),
    country: text(100).required(),
    agent: text(150).required(),
    regDate: Joi.date().required(),
    regNo: text(100).required(),
    schedule: text(50).required(),
    regiType: text(50).required(),
    dossierNo: text(100).required(),
    stockLevel: Joi.number().integer().min(0).default(0),
    inventoryType: Joi.string().valid(...INVENTORY_TYPES),
});

const updateInventorySchema = Joi.object({
    genericName: text(150),
    brandName: text(150),
    dosage: text(100),
    packSize: text(50),
    packType: text(50),
    manufacturer: text(150),
    country: text(100),
    agent: text(150),
    regDate: Joi.date(),
    regNo: text(100),
    schedule: text(50),
    regiType: text(50),
    dossierNo: text(100),
    stockLevel: Joi.number().integer().min(0),
    inventoryType: Joi.string().valid(...INVENTORY_TYPES),
}).min(1);

module.exports = { createInventorySchema, updateInventorySchema };
