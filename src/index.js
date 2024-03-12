const express = require("express")
const app = express()
const port = process.env.PORT || 3000
require("./db/conn1")  
const hbs = require("hbs")
const path = require("path")
const women = require('./models/registers')
const multer  = require("multer")
const session = require("express-session")

const template_path = path.join(__dirname,"../templates/views")
const partials_path = path.join(__dirname,"../templates/partials")
const static_path = path.join(__dirname,"../public")



app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path))
app.set("view engine","hbs")
app.set("views",template_path)
hbs.registerPartials(partials_path)


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Change 'uploads/' to your desired directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });






app.get("/",(req,res)=>{
    res.render("index") 
})  
app.get('/About',(req,res)=>{  
    res.render("About")
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
                console.log("Image filename:", upload.filename);
                const registered = await registerwomen.save();
                console.log(registered)
                res.render("index")
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




// Login check
app.post('/login',async (req,res)=>{
    try{
        const password = req.body.Password;
        const useremail = await women.findOne({Email:req.body.Email});
        console.log(useremail)      
        if(useremail && useremail.Password===password){
                res.status(201).render("index");
        }else{
            res.send("Invalid Email or password");
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