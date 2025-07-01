const mongoose = require('mongoose');
const Listing = require('./models/listing.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/broker';

const images = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
  'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',
  'https://images.unsplash.com/photo-1467987506553-8f3916508521',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
  'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  'https://images.unsplash.com/photo-1519985176271-adb1088fa94c',
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
  'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1467987506553-8f3916508521',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
  'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  'https://images.unsplash.com/photo-1519985176271-adb1088fa94c',
  'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',
  'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1467987506553-8f3916508521',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
  'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  'https://images.unsplash.com/photo-1519985176271-adb1088fa94c',
  'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',
  'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1467987506553-8f3916508521',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
  'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
];

const descriptions = [
  'A luxurious apartment with a stunning city view and modern amenities. Perfect for families and professionals.',
  'Spacious villa with a private garden and pool, located in a peaceful neighborhood.',
  'Modern studio in the heart of the city, close to all major attractions and public transport.',
  'Elegant house with a large backyard, ideal for gatherings and relaxation.',
  'Cozy apartment with natural lighting and a beautiful balcony.',
  'Charming home with updated kitchen and smart home features.',
  'Bright and airy flat with open-plan living and designer finishes.',
  'Family-friendly house with a safe play area and nearby schools.',
  'Exclusive penthouse with panoramic views and luxury fittings.',
  'Affordable studio perfect for students or young professionals.',
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  await Listing.deleteMany({});
  const listings = [];
  for (let i = 1; i <= 40; i++) {
    listings.push({
      name: `Test Listing ${i}`,
      description: descriptions[i % descriptions.length] + ` (Listing #${i})`,
      regularPrice: 100 + i * 10,
      imageUrls: [images[i % images.length]],
      address: `${i} Main St, City Center`,
      discountedPrice: 80 + i * 8,
      bathrooms: 2 + (i % 3),
      bedrooms: 3 + (i % 4),
      furnished: i % 2 === 0,
      parking: i % 3 !== 0,
      type: ['apartment', 'villa', 'studio', 'house'][i % 4],
      offer: i % 2 === 0,
      userRef: '686350a04151d09513406c83',
      location: 'City Center',
    });
  }
  await Listing.insertMany(listings);
  console.log('Seeded 40 listings!');
  process.exit(0);
}

seed(); 