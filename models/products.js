const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    UserID: {
        type: String,
        required: true,
        unique: true
    },
    productID: {
        type: String,
        required:true,
    },
    pname: {
        type: String,
        required:true,
    },
    price: {
        type: String,
        required: true
    },  
    image_location: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        required:true,
        type: Number,
    },
    details:{
        required:true,
        type: String,
    },
    size:{
        required:true,
        type:String,
    },
    tags:{
        required:true,
        type:[String]
    }
}, {
    timestamps: true
});

// making model with explicit collection name
const product = mongoose.model("product", productsSchema);

module.exports=product;