const jwt=require('jsonwebtoken') 
const AppError=require('../utills/error')


const verfiyToken=(req,res,next)=>{
const token=req.cookies.jwt;

if(!token) return next(new AppError('unauthorized', 401))
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{

        if(err) return next(new AppError('token is not valied or forbidden', 403))
            req.user=user
        next();
    
        });

}
module.exports=verfiyToken;