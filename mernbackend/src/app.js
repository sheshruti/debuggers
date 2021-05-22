const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const port =  process.env.PORT||3000;
require("./db/connection");
const auth = require("./middileware/auth");
const Signup = require("./models/signups");
const { url } = require("inspector");


const static_path = path.join( __dirname,"../public");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.set("view engine","hbs");
app.use(express.static(static_path));


app.get("/", (req, res) => {
    res.render("index", {sign_in: "sign in",signin:"signin",sign_up:"sign up",signup:"signup",firsthandbook:"signin",secondhandbook:"signin" ,login:true})
});

app.get("/signup", (req, res)=>{
    res.render("signup")
});
app.get("/logout", auth, (req, res) => {
    try {
        res.clearCookie("jwt");
        res.render("index", {sign_in: "sign in",signin:"signin",signup:"signup",sign_up:"sign up", login:true})
    } catch (error) {
        
    }
   
});app.get("/signin",(req, res)=>{res.render("signin")});


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
               expires:new Date(Date.now()+ 100000)
           });
           
           
          const registered = await registerationStudent.save();
          res.status(201).render("index",{signin:"signin",sign_in:"sign in",signup:" ",sign_up:" ",login:true});
           

        }else{
            res.send("password are not matching")
        }

        
    } catch (error) {
        res.status(400).send("this is error");
        
    }
});

    
        
    

app.post("/signin",async(req,res)=>{
    try {const email= req.body.email;
        const password = req.body.password;
        
     const usermail=   await Signup.findOne({email:email});
     const firstname = usermail.firstname;
     const isMatch= bcrypt.compare(password, usermail.password);

     const token = await usermail.generateAuthToken();
     console.log("the token"+token);
     res.cookie("jwt", token,{
         expires:new Date(Date.now()+ 100000)

     });
     app.get("/firsthand", auth,(req,res)=>{
        res.render("firsthand",{firstname: firstname ,sign_in:"logout" ,sign_up:" " ,signin:"logout", login:true})
    });
    app.get("/secondhand", auth,(req,res)=>{
        res.render("secondhand",{firstname: firstname ,sign_in:"logout" ,sign_up:" " ,signin:"logout", login:true})
    });
          

     
  
     if(isMatch){
         
       
         res.status(201).render("index",{firstname: firstname ,sign_in:"logout" ,sign_up:" " ,signin:"logout",secondhandbook:"secondhand",firsthandbook:"firsthand" ,login:true});
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
