const mongoose =require('mongoose')

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select: false
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    avatar: {
        type: String,
        default: function() {
            // Use DiceBear Avatars for a random avatar
            const seed = Math.random().toString(36).substring(2, 15);
            return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`;
        }
    },
    // role: {
    //     type: String,
    //     default: 'user'
    // },
},{timestamps:true});


const User=mongoose.model('User',userSchema);

module.exports = User;