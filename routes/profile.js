const express = require('express');
const router=express.Router()
const {checkUserAuthentication}=require("../middlewares/auth")
const {profileProductsDisplay,displayOrders}=require("../controllers/profile")

router.get("/",checkUserAuthentication,profileProductsDisplay);
// router.get("/orders",checkUserAuthentication,displayOrders)
router.get("/orders",checkUserAuthentication,displayOrders)

module.exports=router;


