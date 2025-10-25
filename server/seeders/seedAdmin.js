require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("../models/User");

// MongoDB connection string
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://prms:prms1234@cluster0.8kuookx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/prms";

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("SuperAdmin already exists:", existingAdmin.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD || "admin@123$",
      10
    );

    const superAdmin = await User.create({
      name: "System Admin",
      email:
        process.env.SUPER_ADMIN_EMAIL || "selvakumarthushanthan5@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created:", superAdmin.email);
    process.exit(0);
  } catch (error) {
    console.error("Error creating Admin:", error.message);
    process.exit(1);
  }
};

createSuperAdmin();
