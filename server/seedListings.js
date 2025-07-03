const mongoose = require('mongoose');
const Listing = require('./models/listing.model');
const User = require('./models/user.models');
const fs = require('fs');
require('dotenv').config();

async function seedListings() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB');

    // Find a user to associate with listings
    const user = await User.findOne();
    if (!user) {
      throw new Error('No user found in the database. Please create a user first.');
    }

    // Load listings from JSON file
    const rawData = fs.readFileSync('./seedListingsData.json', 'utf-8');
    let listings = JSON.parse(rawData);

    // Replace placeholders with real user info
    listings = listings.map(listing => ({
      ...listing,
      userRef: user._id.toString(),
      email: user.email
    }));

    await Listing.deleteMany({}); // Clear old listings
    await Listing.insertMany(listings);
    console.log('Seeded listings successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedListings(); 