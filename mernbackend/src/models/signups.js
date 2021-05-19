const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const studentSchema = new mongoose.Schema({firstname
    :{type:String,
    required:true},
    
    lastname
    :{type:String,
        required:true},
    
    username
    :
    {type:String,
        required:true},
    email
    :{type:String,
        required:true,
    unique:true},
    phonenumber
    :{type:String,
        
        
    },
    
    password
    :
    {type:String,
        required:true},
    confirmpassword
    :
    {type:String,
        required:true},
        tokens:[{
            token:{type:String,
            required:true}
        }]

})
studentSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, "mynameisdevelopershashisinghhelloljdwjlels");
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {res.send("error" + error);
    console.log("the error"+ error);
        
    }}










studentSchema.pre("save",async function(next){
    if(this.isModified("password")){
    console.log(`current password is ${this.password}`);
    this.password = await bcrypt.hash(this.password,10);
    this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
    console.log(`the current password is ${this.password}`);}
    next();

})
const Signup = new mongoose.model("Signup",studentSchema);
module.exports= Signup;
