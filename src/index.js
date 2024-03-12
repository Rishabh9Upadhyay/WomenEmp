require("dotenv").config();
const express = require("express")
const app = express()
const port = process.env.PORT || 3000
require("./db/conn1")  
const hbs = require("hbs")
const path = require("path")
const women = require('./models/registers')
const multer  = require("multer")
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const auth = require("./middleware/auth");

const template_path = path.join(__dirname,"../templates/views")
const partials_path = path.join(__dirname,"../templates/partials")
const static_path = path.join(__dirname,"../public")


app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path))
app.set("view engine","hbs")
app.set("views",template_path)
hbs.registerPartials(partials_path)


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


// Set up session middleware
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));



// req.session.name = useremail.Name;
// req.session.pimg = useremail.imagename;
// req.session.email = useremail.Email;

app.get("/",(req,res)=>{
    if(req.session.name){
        res.render("index",{
            user: req.session.name, 
            pimg:  req.session.pimg, 
            email: req.session.email
        })
    }
    else{   
        res.render("index") 
    }
})  
app.get('/About',auth,(req,res)=>{  
    if(req.session.name){
        res.render("About",{
            user: req.session.name, 
            pimg:  req.session.pimg, 
            email: req.session.email
        })
    }
    else{   
        res.render("About") 
    }
})
app.get("/signin",(req,res)=>{
    res.render("signin")
})
app.get("/signup",(req,res)=>{
    res.render("signup")  
})
app.post("/register",upload.single("imagename"), async (req,res)=>{
    try{
        const pass = req.body.Password;
        const cpass = req.body.Cpassword;
        const changedFilenmae = req.file.filename;
        const useremail = await women.findOne({Email:req.body.Email});
        if(useremail===null){
            if(pass===cpass){
                if (!req.file.mimetype.startsWith('image/')) {
                    return res.status(400).send('Please upload an image file.');
                }
                const registerwomen = new women({
                    Name: req.body.Name,
                    Email: req.body.Email,
                    Gender: req.body.Gender,
                    imagename: changedFilenmae,
                    Password: req.body.Password,
                    Cpassword: req.body.Cpassword
                })
                const token = await registerwomen.generateAuthToken();
                console.log("The success part jwt:"+token)

                res.cookie("jwt",token,{
                    expires: new Date(Date.now()+65000000),
                    httpOnly: true
                });

                req.session.name = req.body.Name;
                req.session.pimg = changedFilenmae;
                req.session.email = req.body.Email;

                const registered = await registerwomen.save();
                console.log(registered)
                res.render("index",{
                    user: req.session.name,
                    pimg: req.session.pimg,
                    email: req.session.email
                })
            }
            else{
                res.render("signup",{alert2: req.body})
            }
        }
        else{
            res.render("signup",{alert1: req.body})
        }
        
    }catch(e){
        console.log(e)
    }
})



app.post('/login',async (req,res)=>{
    try{
        const Email = req.body.Email;
        const Password = req.body.Password;
        const useremail = await women.findOne({Email});
        const isMatch = await bcrypt.compare(Password,useremail.Password);
        
        const token = await useremail.generateAuthToken();

        

        if(isMatch){
            res.cookie("jwt",token,{
                expires: new Date(Date.now()+65000000),
                httpOnly: true,
                // secure: true
            })
            req.session.name = useremail.Name;
            req.session.pimg = useremail.imagename;
            req.session.email = useremail.Email;
            res.status(200).render("index",{
                user: req.session.name,
                pimg: req.session.pimg,
                email: req.session.email
            })
        }
        else{
            res.send("Invalid email or password")
        }
    }catch(e){
        res.status(400).send("Invalid Email or Password..........");
    }
})


app.listen(port,(err)=>{
    if(err){        
        console.log(err)
    }
    else{
        console.log(`Server is listning at port number ${port}`)
    }
})