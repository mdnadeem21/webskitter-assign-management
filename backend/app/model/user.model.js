const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String, 
    },
    avatar:{
        type:String,
        default:'user-avatar.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'admin','manager'],
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:false
    },
    refreshToken:{
        type:String,
        default:null
    }
}, { timestamps: true });

const User = mongoose.model('manage-assign-user', userSchema);
module.exports = User