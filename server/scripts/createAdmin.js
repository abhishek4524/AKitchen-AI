#!/usr/bin/env node

const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");

async function createAdmin() {
  try {
    console.log("🔧 Connecting to MongoDB...");

    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);

    console.log("✅ Connected");

    const existing = await User.findOne({ email: "visiodraft@gmail.com" });

    if (existing) {
      console.log("⚠️ Admin already exists");
      return process.exit();
    }

    console.log("👤 Creating Admin...");

    await User.create({
      name: "Admin",
      email: "visiodraft@gmail.com",
      password: "Abhishek4524", // auto hash ho jayega
      role: "admin",
    });

    console.log("✅ Admin Created Successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

createAdmin();