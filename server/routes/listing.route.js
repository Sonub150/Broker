const express=require('express')
const listing = require('../controllers/createListing.con');
const verfiyToken = require('../utills/verifyUser');


const router=express()

router.post('/create', verfiyToken,listing.createListing)


module.exports=router;