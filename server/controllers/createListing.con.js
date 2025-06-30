const Listing=require('../models/listing.model')

 const createListing= async (req,res,next)=>{
    try{
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


 const listing={
    createListing,
 }

 module.exports=listing;