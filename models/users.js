const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    UserID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required:false,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        required:false,
        type: String,
    },
    gender: {
        required:false,
        type: String,
    },

}, {
    timestamps: true
});

// making model with explicit collection name
const User = mongoose.model("user", userSchema);

module.exports=User;