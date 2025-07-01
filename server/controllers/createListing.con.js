const Listing=require('../models/listing.model');
const AppError = require('../utills/error');
const User = require('../models/user.models');
const mongoose = require('mongoose');

 const createListing= async (req,res,next)=>{
    try{
        // Trim userRef if present
        if (req.body.userRef && typeof req.body.userRef === 'string') {
            req.body.userRef = req.body.userRef.trim();
        }
        // Debug: Log userRef and DB connection
        console.log('userRef received:', req.body.userRef);
        console.log('Current DB URI:', mongoose.connection.client.s.url || mongoose.connection.client.s.urlString || process.env.MONGO_URI);
        // Try to find the user
        const user = await User.findById(req.body.userRef);
        console.log('user found:', user);
        if (!user) {
            // Log all user IDs for diagnosis
            const allUsers = await User.find({}, { _id: 1, email: 1 });
            console.log('All user IDs in DB:', allUsers.map(u => u._id.toString()));
            return res.status(400).json({
                message: 'User not found for the provided userRef.'
            });
        }
        req.body.email = user.email;
        // Validate email
        if (!req.body.email || !/^\S+@\S+\.\S+$/.test(req.body.email)) {
            return res.status(400).json({
                message: 'A valid contact email is required for the listing.'
            });
        }
        const listing=await Listing.create(req.body);
        

        res.status(201).json({
            message:"listing created successfully",
            listing:listing
        })


    }catch(err){
        res.status(400).json({
            message: 'Failed to create listing',
            error: err.message
        });
    }

 };

 const listingDelete = async (req, res, next) => {
    try {
        // 1. Check if listing exists
        const listing = await Listing.findById(req.params.id);
        
        if (!listing) {
            return next(new AppError(404, 'Listing not found'));
        }

        // 2. Verify ownership - only the listing owner can delete it
        if (req.user.id !== listing.userRef) {
            return next(new AppError(403, 'You are not authorized to delete this listing'));
        }

        // 3. Delete the listing
        await Listing.findByIdAndDelete(req.params.id); // Fixed: Use Listing model, not listing instance

        // 4. Send success response
        res.status(200).json({
            status: 'success',
            message: 'Listing deleted successfully',
        });

    } catch (error) {
        // 5. Handle any errors
        next(error);
    }
};

const listingUpdate = async (req, res, next) => {
    try {
        // 1. Check if listing exists
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(new AppError(404, 'Listing not found'));
        }

        // 2. Verify ownership - only the listing owner can update it
        if (req.user.id !== listing.userRef) {
            return next(new AppError(403, 'You are not authorized to update this listing'));
        }

        // 3. Validate request body (optional but recommended)
        // if (!req.body || Object.keys(req.body).length === 0) {
        //     return next(new AppError(400, 'No update data provided'));
        // }

        // 4. Update the listing
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,         // Return the updated document
                runValidators: true // Run model validators on update
            }
        );

        // 5. Check if update was successful
        if (!updatedListing) {
            return next(new AppError(500, 'Failed to update listing'));
        }

        // 6. Send success response
        res.status(200).json({
            status: 'success',
            data: {
                listing: updatedListing
            }
        });

    } catch (error) {
        // 7. Handle errors (e.g., validation errors, DB errors)
        next(error); // Pass to global error handler
    }
};

// Controller to fetch a single listing by its ID
// GET /api/listing/:id
const getListingById = async (req, res, next) => {
  try {
    // 1. Find the listing by ID from the database
    const listing = await Listing.findById(req.params.id);
    // 2. If not found, return 404
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    // 3. Return the listing data
    res.status(200).json({ data: { listing } });
  } catch (err) {
    // 4. Pass any errors to the error handler
    next(err);
  }
};

// Controller to get all listings
// GET /api/listings
const getAllListings = async (req, res, next) => {
  try {
    // 1. Fetch all listings from the database
    const listings = await Listing.find();
    // 2. Return the listings array
    res.status(200).json({ data: { listings } });
  } catch (err) {
    // 3. Pass any errors to the error handler
    next(err);
  }
};

const listing={
    createListing,
    listingDelete,
    listingUpdate,
    getListingById,
    getAllListings,
}

module.exports=listing;