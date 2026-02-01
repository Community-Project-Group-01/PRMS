// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const { connectDB } = require("./config/db");
const cookieParser = require("cookie-parser");
const { patientRouter } = require("./routes/patientRoutes");
const { doctorRouter } = require("./routes/doctorRoutes");
const { userRouter } = require("./routes/userRoutes");
const { medicalRecordRouter } = require("./routes/medicalRecordRoutes");
const { prescriptionRouter } = require("./routes/prescriptionRoutes");
const { appointmentRouter } = require("./routes/appointmentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ---------------------- Middleware ----------------------
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(helmet());
app.use(compression());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ---------------------- Routes ----------------------
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to PRMS API",
    status: "Server is running successfully!",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/patient", patientRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/med", medicalRecordRouter);
app.use("/api/prescription", prescriptionRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/admin", adminRoutes);

// ---------------------- Error Handling ----------------------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  const logger = require("./utils/logger");
  logger.error("Unhandled error", { error: err.message, stack: err.stack });
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// ---------------------- Database & Server ----------------------
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
      const logger = require("./utils/logger");
      const server = app.listen(PORT, () =>
      logger.info(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      )
    );

    // Graceful shutdown
    process.on("SIGTERM", () => {
      const logger = require("./utils/logger");
      logger.info("SIGTERM received, shutting down gracefully...");
      server.close(() => logger.info("Process terminated"));
    });

    process.on("unhandledRejection", (err) => {
      const logger = require("./utils/logger");
      logger.error("UNHANDLED REJECTION", { error: err.message, stack: err.stack });
      server.close(() => process.exit(1));
    });

    process.on("uncaughtException", (err) => {
      const logger = require("./utils/logger");
      logger.error("UNCAUGHT EXCEPTION", { error: err.message, stack: err.stack });
      process.exit(1);
    });
  } catch (err) {
    const logger = require("./utils/logger");
    logger.error("Failed to connect DB", { error: err.message, stack: err.stack });
    process.exit(1);
  }
})();
