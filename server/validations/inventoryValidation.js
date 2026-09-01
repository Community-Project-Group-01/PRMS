const Joi = require("joi");

const text = (max = 100) => Joi.string().trim().min(1).max(max);

const INVENTORY_TYPES = [
    "Medicine",
    "Material",
    "Medical Device",
    "Consumable",
    "Equipment",
    "Diagnostic",
    "Other",
    "Drug",
];

const createInventorySchema = Joi.object({
    inventoryType: Joi.string().valid(...INVENTORY_TYPES).default("Medicine"),
    brandName: text(150).required(),
    stockLevel: Joi.number().integer().min(0).default(0),
    genericName: Joi.when("inventoryType", {
        is: Joi.valid("Medicine", "Drug"),
        then: text(150).required(),
        otherwise: text(150).optional().allow("", null),
    }),
    dosage: Joi.when("inventoryType", {
        is: Joi.valid("Medicine", "Drug"),
        then: text(100).required(),
        otherwise: text(100).optional().allow("", null),
    }),
    packSize: text(50).optional().allow("", null),
    packType: text(50).optional().allow("", null),
    manufacturer: text(150).optional().allow("", null),
    country: text(100).optional().allow("", null),
    agent: text(150).optional().allow("", null),
    regDate: Joi.date().optional().allow(null, ""),
    regNo: text(100).optional().allow("", null),
    schedule: text(50).optional().allow("", null),
    regiType: text(50).optional().allow("", null),
    dossierNo: text(100).optional().allow("", null),
});

const updateInventorySchema = Joi.object({
    inventoryType: Joi.string().valid(...INVENTORY_TYPES),
    brandName: text(150),
    genericName: text(150).allow("", null),
    dosage: text(100).allow("", null),
    packSize: text(50).allow("", null),
    packType: text(50).allow("", null),
    manufacturer: text(150).allow("", null),
    country: text(100).allow("", null),
    agent: text(150).allow("", null),
    regDate: Joi.date().allow(null, ""),
    regNo: text(100).allow("", null),
    schedule: text(50).allow("", null),
    regiType: text(50).allow("", null),
    dossierNo: text(100).allow("", null),
    stockLevel: Joi.number().integer().min(0),
}).min(1);

module.exports = { createInventorySchema, updateInventorySchema };
