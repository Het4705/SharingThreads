const mongoose = require('mongoose');

const ordersSchema= mongoose.Schema({
    ownerId:{
        type:"String",
        required:true,
    },
    renterId:{
        required:true,
        type:"String",
    },
    productId:{
        required:true,
        type:"String"
    },
    status:{
        //pending or completed
        required:true,
        type:"String"
    }
},{
    timestamps:true
});
const orders = mongoose.model("orders", ordersSchema);

module.exports=orders;