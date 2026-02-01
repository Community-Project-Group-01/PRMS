const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI || "mongodb://localhost:27017/prms"
        );
        const logger = require("../utils/logger");
        logger.info("Connected to MongoDB");
    } catch (error) {
        const logger = require("../utils/logger");
        logger.error("MongoDB connection error", { error: error.message, stack: error.stack });
        process.exit(1);
    }
};

module.exports = { connectDB }