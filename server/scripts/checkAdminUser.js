const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const User = require('../models/User');

const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/akitchen';
console.log('Using configured MongoDB URI:', !!uri);

(async () => {
  try {
    await mongoose.connect(uri);
    const email = (process.env.ADMIN_EMAIL || 'visiodraft@gmail.com').toLowerCase();
    const u = await User.findOne({ email }).select('+password');
    console.log('Admin user found:', !!u);
    if (u) {
      console.log({
        id: u._id,
        email: u.email,
        name: u.name,
        role: u.role,
        isAdmin: u.isAdmin,
        hasPasswordHash: !!u.passwordHash,
        hasLegacyPassword: !!u.password,
        canAccessAdmin: u.isAdminUser(),
      });
    }
  } catch (e) {
    console.error('Error querying DB:', e);
  } finally {
    await mongoose.disconnect();
  }
})();
