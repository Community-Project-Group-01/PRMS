const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
    {
        genericName: { type: String, trim: true },
        brandName: { type: String, required: true, trim: true, index: true },
        dosage: { type: String, trim: true },
        packSize: { type: String, trim: true },
        packType: { type: String, trim: true },
        manufacturer: { type: String, trim: true },
        country: { type: String, trim: true },
        agent: { type: String, trim: true },
        regDate: { type: Date },
        regNo: { type: String, trim: true },
        schedule: { type: String, trim: true },
        regiType: { type: String, trim: true },
        dossierNo: { type: String, trim: true },
        stockLevel: { type: Number, required: true, default: 0, min: 0 },
        inventoryType: {
            type: String,
            required: true,
            enum: [
                "Medicine",
                "Material",
                "Medical Device",
                "Consumable",
                "Equipment",
                "Diagnostic",
                "Other",
                "Drug",
            ],
            default: "Medicine",
            index: true,
        },
    },
    { timestamps: true }
);

inventorySchema.index({ stockLevel: 1 });

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = { Inventory };
