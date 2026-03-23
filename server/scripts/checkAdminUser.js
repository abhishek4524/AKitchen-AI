const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/akitchen';
console.log('Using URI:', uri);

const UserSchema = new mongoose.Schema({ email: String, isAdmin: Boolean, password: String, name: String }, { collection: 'users' });
const User = mongoose.model('UserCheck', UserSchema);

(async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const u = await User.findOne({ email: 'admin@example.com' });
    console.log('Admin user found:', !!u);
    console.log(u);
  } catch (e) {
    console.error('Error querying DB:', e);
  } finally {
    await mongoose.disconnect();
  }
})();