// Script to initialize a static admin user
// Run this once to create the default admin account: node backend/scripts/initAdmin.js

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Successfully connected to MongoDB");
  } catch (error) {
    console.error(`❌ ERROR: ${error.message}`);
    process.exit(1);
  }
};

const initAdmin = async () => {
  try {
    await connectDB();

    // Static admin credentials (you can change these)
    const adminEmail = process.env.ADMIN_EMAIL || "admin@admin.com";
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      if (existingAdmin.isAdmin) {
        console.log("✅ Admin user already exists with email:", adminEmail);
        console.log("   You can use this account to log in.");
      } else {
        // Promote existing user to admin
        existingAdmin.isAdmin = true;
        const salt = await bcrypt.genSalt(10);
        existingAdmin.password = await bcrypt.hash(adminPassword, salt);
        await existingAdmin.save();
        console.log("✅ Existing user promoted to admin:", adminEmail);
      }
    } else {
      // Create new admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const adminUser = new User({
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
        avatar: "",
      });

      await adminUser.save();
      console.log("✅ Static admin user created successfully!");
      console.log("   Email:", adminEmail);
      console.log("   Username:", adminUsername);
      console.log("   Password:", adminPassword);
    }

    console.log("\n📝 Note: You can set custom admin credentials using environment variables:");
    console.log("   ADMIN_EMAIL=your-email@example.com");
    console.log("   ADMIN_USERNAME=your-username");
    console.log("   ADMIN_PASSWORD=your-password");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing admin:", error.message);
    process.exit(1);
  }
};

initAdmin();

