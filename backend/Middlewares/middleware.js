const jwt=require('jsonwebtoken')
const dotenv=require('dotenv').config();
const jwtVerify=process.env.JWT_SECRET

const checkToken=(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token){
             console.log("Access Denied: No token provided from middleware.");
             return res.status(401).json({ message: "Access Denied: No token provided." });
             next();
        }
        const decoded = jwt.verify(token, jwtVerify);
        req.userInfo=decoded;
        console.log("u can check the info from here");
        next();
    } catch (error) {
        console.log("this is error in middleware:",error)
    }
}

module.exports={checkToken};