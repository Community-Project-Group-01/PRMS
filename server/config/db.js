const dns = require("dns");
const mongoose = require("mongoose");

// Use public DNS when local/ISP DNS refuses Atlas SRV lookups (querySrv ECONNREFUSED)
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"]);

const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI || "mongodb://localhost:27017/prms",
            { family: 4 }
        );
        const logger = require("../utils/logger");
        logger.info("Connected to MongoDB");
    } catch (error) {
        const logger = require("../utils/logger");
        logger.error("MongoDB connection error", { error: error.message, stack: error.stack });
        if (error.message?.includes("querySrv")) {
            logger.error(
                "SRV DNS failed. Use Google DNS (8.8.8.8), a standard (non-SRV) Atlas URI, or mongodb://127.0.0.1:27017/prms for local MongoDB."
            );
        }
        process.exit(1);
    }
};

module.exports = { connectDB }