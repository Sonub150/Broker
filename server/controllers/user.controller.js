const User=require('../models/user.models')
const AppError=require('../utills/error')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Listing = require('../models/listing.model');

// Improved error handler utility
const errorHandler = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const test=(req,res)=>{
    res.status(200).json({
        message:'test route is working',
        success:true
    })
}

const signup= async(req,res)=>{
    // console.log(req.body)
    const {username,email,password}=req.body;
    const hashedPassword=await bcrypt.hashSync(password,10);
    const user=new User({username,email,password:hashedPassword})
    
    try{
        await user.save()
        res.status(201).json({
            message:'user created successfully',
        })
    }
    catch(err){
        // Log the error for debugging
        console.error('Signup error:', err);
        // Handle duplicate key error (username or email already exists)
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(400).json({
                message: `A user with that ${field} already exists.`
            });
        }
        // Handle validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: err.message
            });
        }
        // Generic error response
        res.status(500).json({
            message:'error creating user',
            error:err.message
        });
    }
}

/**
 * Controller for user sign-in (login)
 * @route POST /api/signin
 * @desc Authenticates a user and returns a JWT token (also sets it as an HTTP-only cookie)
 * @access Public
 */
const signin = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        // 1. Check if user exists and is active
        //    - Select password and active fields explicitly (if they are select: false in schema)
        const user = await User.findOne({ email }).select('+password +active');
        if (!user || !user.active) {
            // If user not found or not active, return error
            return next(new AppError('Invalid email or password', 401));
        }

        // 2. Validate password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            // If password does not match, return error
            return next(new AppError('Invalid email or password', 401));
        }

        // 3. Generate JWT token with user id and role
        const token = jwt.sign(
            { 
                id: user._id,
                role: user.role 
            }, 
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // 4. Set cookie options for JWT
        const cookieOptions = {
            httpOnly: true, // Set to true for production security
            secure: false,
            sameSite: 'lax'
        };

        // 5. Set JWT as HTTP-only cookie
        res.cookie('jwt', token, cookieOptions);

        // 6. Remove sensitive fields from user object before sending response
        const { password: _, active: __, ...userWithoutSensitiveData } = user.toObject();
        
        // 7. Send response with token and user data (without sensitive fields)
        res.status(200).json({
            status: 'success',
            token, // Still available in response for clients that need it
            data: {
                user: userWithoutSensitiveData
            }
        });

    } catch (err) {
        // Log error and return generic error message
        console.error('Login error:', err);
        next(new AppError('Login failed. Please try again later', 500));
    }
};

const google = async (req, res, next) => {
    try {
        const { email, name, googleId, avatar } = req.body;
        let user = await User.findOne({ email });

        if (user) {
            // User exists, sign and return token
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            return res.status(200).json({ status: 'success', token, data: { user: rest } });
        } else {
            // Generate a random password for Google users (not used, but required by schema)
            const GeneratePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(GeneratePassword, 10);

            // Use provided avatar or let schema default handle it
            const newUser = new User({
                username: name ? name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) : email.split("@")[0],
                email,
                password: hashedPassword,
                googleId,
                avatar: avatar, // If Google provides an avatar, use it; otherwise, schema default will be used
                role: 'user',
                active: true
            });

            await newUser.save();

            const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            return res.status(201).json({ status: 'success', token, data: { user: rest } });
        }
    } catch (err) {
        console.error('Google login error:', err);
        next(new AppError('Google login failed. Please try again later', 500));
    }
};

const updateUser = async (req, res, next) => {
    // JWT may contain either 'id' or '_id' depending on how it was signed/decoded
    const userId = req.user.id || req.user._id;
    // Debug: log the values being compared
    console.log('userId from token:', userId, 'req.params.id:', req.params.id);
    // Only allow the user to update their own profile
    if (userId !== req.params.id) return next(new AppError('You do not have permission to update this user', 403));

    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar
                }
            },
            { new: true }
        );

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json({ status: 'success', data: { user: rest } });
    } catch (err) {
        next(err);
    }
};

const getUserListing = async (req, res, next) => {
    try {
        // Check if user ID is provided
        if (!req.params.userId) {
            return next(new AppError('User ID is required', 400));
        }

        // Only allow the user to view their own listings
        if (req.user.id !== req.params.userId) {
            return next(new AppError('You can only view your own listings', 401));
        }

        // Find all listings for the user
        const userListings = await Listing.find({ userRef: req.params.userId });

        // Check if listings exist
        if (!userListings || userListings.length === 0) {
            return next(new AppError('No listings found for this user', 404));
        }

        // Return successful response
        res.status(200).json({
            status: 'success',
            data: {
                listings: userListings
            }
        });
        
    } catch (err) {
        // Pass any errors to the error handling middleware
        next(err);
    }
};

const userControllers={
    test,
    signup,
    signin,
    google,
    updateUser,
    getUserListing,
 }

module.exports=userControllers;