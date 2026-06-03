require("../config/loadEnv");
const bcrypt = require("bcrypt");
const { connectDB } = require("../config/db");
const { User } = require("../models/User");

const createSuperAdmin = async () => {
  try {
    await connectDB();
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
