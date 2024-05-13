const express = require('express');
const router = express.Router();
const {userRentRequest,userProfileHandler,userSignInHandler,userSignUpHandler}= require("../controllers/user.js")
const{checkUserAuthentication}=require("../middlewares/auth.js")

router.post("/profile", userProfileHandler);

router.post("/signup", userSignUpHandler);

router.post("/signin",userSignInHandler);



router.post("/rent",checkUserAuthentication,userRentRequest)

module.exports = router;