#!/usr/bin/env node

const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");

async function createAdmin() {
  try {
    console.log("🔧 Connecting to MongoDB...");

    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);

    console.log("✅ Connected");

    const email = (process.env.ADMIN_EMAIL || "visiodraft@gmail.com").toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "Abhishek4524";
    const name = process.env.ADMIN_NAME || "Admin";

    const existing = await User.findOne({ email }).select("+password");

    if (existing) {
      existing.name = existing.name || name;
      existing.role = "admin";
      existing.isAdmin = true;

      if (existing.password && !existing.passwordHash) {
        existing.passwordHash = existing.password;
        existing.password = undefined;
      } else if (!existing.hasPassword()) {
        existing.passwordHash = password;
      }

      await existing.save();
      console.log("✅ Admin updated:", existing.email);
      return process.exit();
    }

    console.log("👤 Creating Admin...");

    const admin = await User.create({
      name,
      email,
      passwordHash: password,
      role: "admin",
      isAdmin: true,
    });

    console.log("✅ Admin Created Successfully:", admin.email);
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

createAdmin();
