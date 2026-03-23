#!/usr/bin/env node

/**
 * Create Admin User Script
 * Usage: node scripts/createAdmin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
  picture: String,
  role: { type: String, default: "user" },
  isAdmin: { type: Boolean, default: false },
  plan: { type: String, default: "free" },
  settings: {
    theme: { type: String, default: "light" },
    notifications: { type: Boolean, default: true },
  },
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  createdRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    
    // Use the same env var name as server config (MONGO_URI), with a local fallback.
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/akitchen';
    console.log('📍 Connecting to:', mongoURI);
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('\n📋 Admin Credentials:');
      console.log('   Email: admin@example.com');
      console.log('   Password: admin123');
      console.log('   isAdmin:', existingAdmin.isAdmin);
      console.log('\n✅ You can login now!');
      await mongoose.connection.close();
      return;
    }

    console.log('👤 Creating new admin user...');

    // Hash the admin password before storing
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      isAdmin: true,
      role: 'admin',
      picture: null,
      googleId: null,
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('\n🔍 Verification:');
    console.log('   ID:', admin._id);
    console.log('   isAdmin:', admin.isAdmin);
    console.log('   Email:', admin.email);
    console.log('\n⚡ Quick Start:');
    console.log('   1. Start server: npm start');
    console.log('   2. Go to: http://localhost:5173');
    console.log('   3. Login with above credentials');
    console.log('\n⚠️  Security Note:');
    console.log('   Please change this password in production!');
    console.log('   Implement password hashing with bcrypt.\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  MongoDB connection failed!');
      console.error('   Make sure MongoDB is running on localhost:27017');
    }
    process.exit(1);
  }
}

createAdmin();
