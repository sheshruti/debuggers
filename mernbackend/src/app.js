const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const port =  process.env.PORT||8000;
require("./db/con");
const Signup = require("./models/signups");
const { nextTick } = require("process");
const static_path = path.join( __dirname,"../public");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set("view engine","hbs");
app.use(express.static(static_path));


app.get("/", (req, res) => {
    res.render("index")
});
app.get("/signup", (req, res)=>{
    res.render("signup")
});

app.post("/signup",async (req, res)=>{
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password===cpassword){
            const registerationStudent = new Signup({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                email: req.body.email,
                phonenumber: req.body.phonenumber,
                password:password,
                confirmpassword:cpassword
            })
           const token = await registerationStudent.generateAuthToken();
           console.log("the token"+token);
           res.cookie("jwt", token,{
               expires:new Date(Date.now()+ 80000)
           });
           
           
          const registered = await registerationStudent.save();
          res.status(201).render("index");
        }else{
            res.send("password are not matching")
        }

        
    } catch (error) {
        res.status(400).send(error);
        
    }
});
app.get("/signin",(req, res)=>{res.render("signin")
    
        
    
});
app.post("/signin",async(req,res)=>{
    try {const email= req.body.email;
        const password = req.body.password;
     const usermail=   await Signup.findOne({email:email});
     const isMatch= bcrypt.compare(password, usermail.password);

     const token = await usermail.generateAuthToken();
     console.log("the token"+token);
     res.cookie("jwt", token,{
         expires:new Date(Date.now()+ 80000)
     });
          

     
  
     if(isMatch){
       
         res.status(201).render("index");
     }
     
     else{
         res.send("invalid detailse")
     }
        
    } catch (error) {
        res.status(400).send("invalid details")
    }
})

app.listen(port, () => {
    console.log(  `http://localhost:${port}`);
})
