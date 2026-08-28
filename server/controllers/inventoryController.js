const mongoose = require("mongoose");
const { Inventory } = require("../models/Inventory");
const logger = require("../utils/logger");

const REQUIRED_FIELDS = [
    "genericName",
    "brandName",
    "dosage",
    "packSize",
    "packType",
    "manufacturer",
    "country",
    "agent",
    "regDate",
    "regNo",
    "schedule",
    "regiType",
    "dossierNo",
];

const UPDATABLE_FIELDS = [...REQUIRED_FIELDS, "stockLevel", "inventoryType"];

// Create new inventory item
const createInventory = async (req, res) => {
    try {
        const missing = REQUIRED_FIELDS.filter((field) => !req.body[field]);
        if (missing.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missing.join(", ")}`,
            });
        }

        const inventory = new Inventory({
            ...req.body,
            stockLevel: req.body.stockLevel ?? 0,
        });
        await inventory.save();

        return res.status(201).json({
            success: true,
            message: "Inventory item created successfully",
            data: inventory,
        });
    } catch (error) {
        logger.error("Error in createInventory", { error: error.message, stack: error.stack });
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get all inventory items (optional ?search=, ?type=, ?stock=, ?page=, ?limit=)
const getAllInventory = async (req, res) => {
    try {
        const { search, type, inventoryType, stock, stockStatus } = req.query;
        const filter = {};

        // Search by brand name, generic name, manufacturer, agent, or registration number
        if (search && search.trim()) {
            const queryRegex = { $regex: search.trim(), $options: "i" };
            filter.$or = [
                { brandName: queryRegex },
                { genericName: queryRegex },
                { manufacturer: queryRegex },
                { agent: queryRegex },
                { regNo: queryRegex },
            ];
        }

        // Filter by inventory classification / type
        const selectedType = type || inventoryType;
        if (selectedType && selectedType.toLowerCase() !== "all") {
            if (selectedType.toLowerCase() === "medicine") {
                filter.inventoryType = { $in: ["Medicine", "Drug"] };
            } else {
                filter.inventoryType = { $regex: new RegExp(`^${selectedType.trim()}$`, "i") };
            }
        }

        // Filter by stock level status
        const selectedStock = stock || stockStatus;
        if (selectedStock && selectedStock.toLowerCase() !== "all") {
            const normalizedStock = selectedStock.toLowerCase().replace(/[-_ ]/g, "");
            if (normalizedStock === "instock" || normalizedStock === "in") {
                filter.stockLevel = { $gt: 0 };
            } else if (normalizedStock === "lowstock" || normalizedStock === "low") {
                filter.stockLevel = { $gt: 0, $lte: 10 };
            } else if (normalizedStock === "outofstock" || normalizedStock === "out") {
                filter.stockLevel = { $lte: 0 };
            }
        }

        const page = Math.max(1, parseInt(req.query.page || "1", 10));
        const limit = Math.max(1, parseInt(req.query.limit || "10", 10));
        const [inventory, total] = await Promise.all([
            Inventory.find(filter).sort({ brandName: 1 }).skip((page - 1) * limit).limit(limit),
            Inventory.countDocuments(filter),
        ]);
        return res.status(200).json({
            success: true,
            message: "Inventory fetched successfully",
            data: inventory,
            meta: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        logger.error("Error in getAllInventory", { error: error.message, stack: error.stack });
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get single item
const getInventoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid inventory ID" });
        }

        const item = await Inventory.findById(id);
        if (!item) return res.status(404).json({ success: false, message: "Inventory item not found" });

        return res.status(200).json({
            success: true,
            message: "Inventory item fetched successfully",
            data: item,
        });
    } catch (error) {
        logger.error("Error in getInventoryById", { error: error.message, stack: error.stack });
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Update an item
const updateInventory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid inventory ID" });
        }

        const updates = {};
        for (const field of UPDATABLE_FIELDS) {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        }

        const item = await Inventory.findByIdAndUpdate(id, { $set: updates }, {
            new: true,
            runValidators: true,
        });
        if (!item) return res.status(404).json({ success: false, message: "Inventory item not found" });

        return res.status(200).json({
            success: true,
            message: "Inventory item updated successfully",
            data: item,
        });
    } catch (error) {
        logger.error("Error in updateInventory", { error: error.message, stack: error.stack });
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Delete an item
const deleteInventory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid inventory ID" });
        }

        const item = await Inventory.findByIdAndDelete(id);
        if (!item) return res.status(404).json({ success: false, message: "Inventory item not found" });

        return res.status(200).json({ success: true, message: "Inventory item deleted successfully" });
    } catch (error) {
        logger.error("Error in deleteInventory", { error: error.message, stack: error.stack });
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    createInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory,
};
