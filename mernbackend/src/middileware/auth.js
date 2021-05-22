const jwt = require("jsonwebtoken");
const Register = require("../models/signups");
const auth = async (req, res,next)=>{
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,"mynameisdevelopershashisinghhelloljdwjlels");
        next();
    } catch (error) {
        res.status(400).send("login first");
        
    }

}
module.exports= auth;