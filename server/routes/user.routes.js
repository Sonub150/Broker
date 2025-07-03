const express = require('express');
const router=express.Router();
const userControllers=require('../controllers/user.controller')
const verifyUser=require('../utills/verifyUser')

router.get('/test', userControllers.test);
router.post('/signup',userControllers.signup)
router.post('/signin',userControllers.signin)
router.post('/google',userControllers.google)
router.post('/update/:id',verifyUser,userControllers.updateUser)
router.get('/listedItem/:userId',verifyUser,userControllers.getUserListing)

// Signout and Forget Password
router.post('/signout', userControllers.signout)
router.post('/forgetpassword', userControllers.forgetpassword)

router.post('/resetpassword', userControllers.resetpassword)
router.post('/sendotp', userControllers.sendotp)
router.post('/resetpassword-otp', userControllers.resetpasswordOtp)

module.exports=router;