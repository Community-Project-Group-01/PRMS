const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
    {
        genericName: { type: String, required: true, trim: true },
        brandName: { type: String, required: true, trim: true, index: true },
        dosage: { type: String, required: true, trim: true },
        packSize: { type: String, required: true, trim: true },
        packType: { type: String, required: true, trim: true },
        manufacturer: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        agent: { type: String, required: true, trim: true },
        regDate: { type: Date, required: true },
        regNo: { type: String, required: true, trim: true },
        schedule: { type: String, required: true, trim: true },
        regiType: { type: String, required: true, trim: true },
        dossierNo: { type: String, required: true, trim: true },
        stockLevel: { type: Number, required: true, default: 0, min: 0 },
        inventoryType: {
            type: String,
            required: true,
            enum: ["Drug", "Medical Device", "Consumable", "Equipment", "Other"],
            default: "Drug",
        },
    },
    { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = { Inventory };
