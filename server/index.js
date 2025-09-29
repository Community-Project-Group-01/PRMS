// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const { connectDB } = require("./config/db");

const app = express();

// ---------------------- Middleware ----------------------
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));
app.use(helmet());
app.use(compression());

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
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));

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
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
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
