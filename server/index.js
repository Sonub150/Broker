const express=require('express');
const { mongoose } = require('mongoose');
const userRouter=require('./routes/user.routes')
const dotenv = require('dotenv');
const cookieparser=require('cookie-parser')
const createListing=require('./routes/listing.route')
const cors = require('cors');
dotenv.config();

const app=express()
const port=process.env.PORT || 3000

app.use(cors({
  origin: [
    'http://localhost:5173', // local dev
    'https://broker-1-osap.onrender.com' // deployed frontend
  ],
  credentials: true
}));
app.use(cookieparser())
app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log(err)
})

app.use('/api',userRouter)
app.use('/api',createListing)

// --- One-time script to update all listings with the correct email from userRef ---
if (process.env.UPDATE_LISTINGS_EMAIL === 'true') {
  const Listing = require('./models/listing.model');
  const User = require('./models/user.models');
  (async () => {
    try {
      const listings = await Listing.find({});
      let updated = 0;
      for (const listing of listings) {
        if (!listing.email && listing.userRef) {
          const user = await User.findById(listing.userRef);
          if (user && user.email) {
            listing.email = user.email;
            await listing.save();
            updated++;
          }
        }
      }
      console.log(`Updated ${updated} listings with user emails.`);
      process.exit(0);
    } catch (err) {
      console.error('Error updating listings:', err);
      process.exit(1);
    }
  })();
}

// ... existing code ...

if (process.env.LISTINGS_MISSING_EMAIL === 'true') {
  const Listing = require('./models/listing.model');
  (async () => {
    try {
      const listings = await Listing.find({ $or: [ { email: { $exists: false } }, { email: '' } ] });
      if (listings.length === 0) {
        console.log('All listings have an email.');
      } else {
        console.log('Listings missing email:');
        listings.forEach(l => {
          console.log(`Listing ID: ${l._id}, userRef: ${l.userRef}`);
        });
      }
      process.exit(0);
    } catch (err) {
      console.error('Error checking listings:', err);
      process.exit(1);
    }
  })();
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});