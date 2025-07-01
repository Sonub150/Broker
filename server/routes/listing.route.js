const express=require('express')
const listing = require('../controllers/createListing.con');
const verfiyToken = require('../utills/verifyUser');


const router=express()

router.post('/create', verfiyToken,listing.createListing)
router.delete('/listingDelete/:id',verfiyToken,listing.listingDelete)
// Route to update a listing by its ID (use PUT for RESTful update)
router.put('/listingUpdate/:id',verfiyToken,listing.listingUpdate)
// Route to fetch a single listing by its ID
router.get('/listing/:id', verfiyToken, listing.getListingById)
// Route to get all listings
router.get('/listings', listing.getAllListings);


module.exports=router;