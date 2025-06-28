const User=require('../models/user.models')
const AppError=require('../utills/error')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
            expires: new Date(
                Date.now() + (Number(process.env.JWT_COOKIE_EXPIRES_IN) || 7) * 24 * 60 * 60 * 1000
            ),
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
            sameSite: 'strict', // Prevents CSRF
            domain: process.env.COOKIE_DOMAIN // For cross-domain cookies if needed
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

const userControllers={
    test,
    signup,
    signin,
    google,
 }

module.exports=userControllers;