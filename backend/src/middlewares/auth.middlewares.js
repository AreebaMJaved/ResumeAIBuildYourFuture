const jwt=require("jsonwebtoken")
const blackListModel=require("../models/tokenBlackList.model")

async function authUser(req,res,next){
    const token=req.cookies?.token
    if(!token){
        return res.status(401).json({
            message: "token is not provided"
        })
    }
    const isBlackListedToken=await blackListModel.findOne({
        token
    })
    if(isBlackListedToken){
        return res.status(400).json({
            messgae: "token is blacklisted.Please login again"
        })
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
    req.user=decoded
    next()

    

}
catch(err){
    return res.status(401).json({
        message: "token is invalid"
    })
}}

module.exports={authUser}