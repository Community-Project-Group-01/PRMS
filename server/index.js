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
  console.error("Error:", err.message);
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// ---------------------- Database & Server ----------------------
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () =>
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      )
    );

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully...");
      server.close(() => console.log("Process terminated"));
    });

    process.on("unhandledRejection", (err) => {
      console.error("UNHANDLED REJECTION", err);
      server.close(() => process.exit(1));
    });

    process.on("uncaughtException", (err) => {
      console.error("UNCAUGHT EXCEPTION", err);
      process.exit(1);
    });
  } catch (err) {
    console.error("Failed to connect DB", err);
    process.exit(1);
  }
})();
