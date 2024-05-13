const {getUser}= require ("../services/auth.js") 

function checkUserAuthentication(req,res,next)
{
    const token=req.cookies.token;
    console.log("here")
    if(!token)
    {
        console.log("Not Login")
        return res.redirect("/login")
    }

    const user= getUser(token)

    if(!user)
    {
        console.log("Token not verified")
        return res.redirect("/login")  
    }
    
    req.user = user;
    next();
}

module.exports={
    checkUserAuthentication
}