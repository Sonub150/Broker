const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    regularPrice: {
        type: Number,
        required: true
    },
    imageUrls: {
        type: Array,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    furnished: {
        type: Boolean,
        required: true
    },
    parking: {
        type: Boolean,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    offer: {
        type: Boolean,
        required: true
    },
    userRef: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, { timestamps: true });  // <-- timestamps should be the second argument to Schema

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;