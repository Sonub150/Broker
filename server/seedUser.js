const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.models');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Support both BACKEND and MONGO for MongoDB connection string
const backend = process.env.BACKEND;
const mongo = process.env.MONGO;
let mongoUri = mongo;
if (backend && backend.startsWith('mongodb')) {
  mongoUri = backend;
}

const seedAdmin = async () => {
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const adminEmail = 'admin@example.com';
  const adminUsername = 'admin';
  const adminPassword = '123456'; // Change as needed

  // Check if admin already exists
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log('Admin user already exists.');
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = new User({
    username: adminUsername,
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
    active: true,
  });

  await adminUser.save();
  console.log('Admin user created successfully.');
  await mongoose.disconnect();
};

seedAdmin().catch((err) => {
  console.error('Error seeding admin user:', err);
  mongoose.disconnect();
}); 