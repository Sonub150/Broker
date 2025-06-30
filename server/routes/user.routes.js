const express = require('express');
const router=express.Router();
const userControllers=require('../controllers/user.controller')
const verifyUser=require('../utills/verifyUser')

router.get('/test', userControllers.test);
router.post('/signup',userControllers.signup)
router.post('/signin',userControllers.signin)
router.post('/google',userControllers.google)
router.post('/update/:id',verifyUser,userControllers.updateUser)


module.exports=router;