const mongoose = require('mongoose')
const userSchema = mongoose.Schema({ //also new mongoose.Schema works 
//userSchema is both class and function    
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        isEmail: true,
    }, 
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    },
    userType: {
        type: String,
        required: true,
        default: 'Customer',
    },
    userStatus: {
        type: String,
        required: true,
        default: 'Approved',  
    }
})

module.exports = mongoose.model('User', userSchema)