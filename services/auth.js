const jwt=require('jsonwebtoken')

const secretKey="WildPointers#1234**$$"

function setUser(user){
    return jwt.sign({
        _id:user._id,
        email:user.email,
        uid:user.UserID
    },secretKey)  // will be passed as hashed token
}

function getUser(token)
{
    if(!token) return null
    return jwt.verify(token,secretKey)
}

module.exports={
    setUser,getUser
}