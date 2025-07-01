const mongoose = require('mongoose');
const User = require('./models/user.models');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/broker';

async function seedUser() {
  await mongoose.connect(MONGO_URI);
  const user = {
    _id: mongoose.Types.ObjectId('686350a04151d09513406c83'),
    username: 'testuser',
    email: 'testuser@example.com',
    password: '$2b$10$QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiop', // dummy hash, not for real use
    active: true
  };
  await User.deleteOne({ _id: user._id });
  await User.create(user);
  console.log('Seeded user with _id 686350a04151d09513406c83');
  process.exit(0);
}

seedUser(); 