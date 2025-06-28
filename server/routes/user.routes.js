const express = require('express');
const router=express.Router();
const userControllers=require('../controllers/user.controller')

router.get('/test', userControllers.test);
router.post('/signup',userControllers.signup)
router.post('/signin',userControllers.signin)
router.post('/google',userControllers.google)


module.exports=router;