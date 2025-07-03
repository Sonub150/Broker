const mongoose = require('mongoose');
const Listing = require('./models/listing.model');
require('dotenv').config();

const imageUrls = [
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
  "https://images.unsplash.com/photo-1519985176271-adb1088fa94c",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
  "https://images.unsplash.com/photo-1467987506553-8f3916508521",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e",
  "https://www.embassyindia.com/wp-content/uploads/2019/03/Entry_Hires_01-min-2.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2017/03/sky-bedroom-1.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2017/03/indiabulls-sky-living-room-1.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2017/06/2O0A6971-Edit-2-1.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2017/03/sky-living-room-1.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2016/02/IBB_GrdFlr_Study_9337-7.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2019/04/03-Club-House-Swimming-Pool-6.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2015/12/1-15.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2015/12/1-7.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2015/12/2-7.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2015/12/4-3.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2015/12/3-6.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2015/12/1-23.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2015/12/3-5.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2015/12/1-24.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2017/03/About2-1-1.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2015/12/2-19.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2015/12/3-17.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2017/03/About3-4-1.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2015/12/4-10.jpg",
  "https://www.embassyindia.com/wp-content/uploads/2015/12/5-4.jpg",
  "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd"
];

const userRef = "68665abe492d7ded1ff22e12";
const locations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Gurgaon", "Noida", "Ahmedabad"];
const types = ["apartment", "house", "villa", "penthouse", "studio"];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateListing = (i) => {
  const location = locations[i % locations.length];
  const type = types[i % types.length];
  return {
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} in ${location}`,
    description: `A beautiful ${type} located in ${location}. Modern amenities, great views, and comfortable living. Listing number ${i + 1}.`,
    regularPrice: getRandomInt(100, 600),
    imageUrls: [
      imageUrls[(i * 3) % imageUrls.length],
      imageUrls[(i * 3 + 1) % imageUrls.length],
      imageUrls[(i * 3 + 2) % imageUrls.length]
    ],
    address: `${getRandomInt(1, 999)} ${location} Main Road`,
    discountedPrice: getRandomInt(80, 550),
    bathrooms: getRandomInt(1, 6),
    bedrooms: getRandomInt(1, 7),
    furnished: i % 2 === 0,
    parking: i % 3 !== 0,
    type,
    offer: i % 4 === 0,
    userRef,
    location
  };
};

const seedListings = async () => {
  await mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Remove all existing listings (optional)
  await Listing.deleteMany({});

  const listings = Array.from({ length: 30 }, (_, i) => generateListing(i));
  await Listing.insertMany(listings);
  console.log('30 listings seeded successfully.');
  await mongoose.disconnect();
};

seedListings().catch((err) => {
  console.error('Error seeding listings:', err);
  mongoose.disconnect();
}); 