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
const blogs = require("./models/blogs");
const mongooes = require("mongoose")
const AddQuery = require("./models/Query")
const contact = require("./models/contact")
const contest = require("./models/Contest")
const ans1 = require("./models/qna")

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


app.get("/profile",auth,async (req,res)=>{
    try{
        const result  = await blogs.find({Email: req.user.Email}).sort({date: -1});
        res.render("profile",{
            user: req.session.name, 
            pimg:  req.session.pimg, 
            email: req.session.email,
            data: result
        })
    }catch(e){
        console.log(e);
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
app.get("/writeblog", auth, (req,res)=>{
    res.render("writeblog",{
        user: req.session.name, 
        pimg:  req.session.pimg, 
        email: req.session.email
    })
})
app.get("/update", auth, (req,res)=>{
    res.render("update",{
        user: req.session.name, 
        pimg:  req.session.pimg, 
        email: req.session.email
    })
})
app.get("/qna", auth,async (req,res)=>{
    try{
        const records = await AddQuery.find().sort({date: -1})
        res.render("QNA",{
            user: req.session.name, 
            pimg:  req.session.pimg, 
            email: req.session.email,
            qnar: records
        })
    }catch(e){
        console.log(e);
    }
})
// app.get("/Community", auth,async (req,res)=>{
//     const result = await AddQuery.findOne({Email:req.session.email})
//     res.render("Community",{
//         user: req.session.name, 
//         pimg:  req.session.pimg, 
//         email: req.session.email,
//         data1: result
//     })
// })
app.get("/Community", auth, async (req, res) => {
    try {//{ Email: req.session.email }
        const result = await AddQuery.find({ Email: req.session.email }).sort({data: -1})
        console.log("Query Data:", result);
        res.render("Community", {
            user: req.session.name,
            pimg: req.session.pimg,
            email: req.session.email,
            data1: result
        });
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/seeblogs", auth, async (req, res) => {
    try {
        const result = await blogs.find().sort({ date: -1 });
        res.render("seeblogs", {
            user: req.session.name,
            pimg: req.session.pimg,
            email: req.session.email,
            data: result
        });
    } catch (e) {
        console.log(e);
    }
});
app.get("/writeblog1",auth, async (req,res)=>{
    try{
        const result = await blogs.find().sort({ date: -1 });
        res.render("seeblogs", {
            user: req.session.name,
            pimg: req.session.pimg,
            email: req.session.email,
            data: result,
            sms: true
        });
    }catch(e){
        console.log(e);
    }
})



app.post("/addblog",auth,async (req,res)=>{
    try{
        const blogdoc = new blogs({
            Name: req.user.Name,
            Email: req.user.Email,
            imagename: req.user.imagename,
            blogcontent: req.body.blogcontent
        })
        const saved = await blogdoc.save();
        console.log(saved)
        const result = await blogs.find().sort({ date: -1 });
        res.render("seeblogs",{
            user: req.session.name, 
            pimg:  req.session.pimg, 
            email: req.session.email,   
            data: result
        })
    }catch(e){
        console.log(e)
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


app.get("/logout",auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((curElement)=>{
            return curElement.token !== req.token;
        })
        res.clearCookie("jwt");
        await req.user.save();
        res.render("index");
    }catch(e){
        console.log(e)
    }
})
app.get("/logouteverywhere", auth,async (req,res)=>{
    try{
        req.user.tokens = [];
        res.clearCookie("jwt");
        await req.user.save();
        res.render("login");
    }catch(e){
        res.status(500).send(e);
    }
})

app.get('/update',auth,async (req,res)=>{   
    const result = await women.findOne({Email:req.session.email})
    if(req.session.name){
        res.render("update",{
            user: req.session.name, 
            pimg:  req.session.pimg, 
            email: req.session.email,
            alert4: result
        })
    }
    else{    
        res.render("About") 
    }
})

app.post("/Query",auth,async (req,res)=>{
    try{
        const QueryDoc = new AddQuery({
            Quries: req.body.Quries,
            Email: req.user.Email,
            Name: req.user.Name,
            imagename: req.user.imagename
        })
        const saved = await QueryDoc.save();
        const result = await AddQuery.find({ Email: req.session.email }).sort({date: -1})
        console.log(saved)
        res.render("Community",{
            user: req.session.name, 
            pimg:  req.session.pimg,
            email: req.session.email,
            data1: result
        })
    }catch(e){
        console.log(e);
    }
})

// Route parameters allow you to extract data from the URL and use it within your route handler functions. 
// Route parameters enable you to create dynamic routes that can handle different requests based on the values provided in the URL.
app.get('/profile/:_id',auth, async (req, res) => {
    try{
        const docId1 = req.params._id;
        const docId = docId1.replace(':', '');
        const result2 = await blogs.findOne({_id:docId})
        const result1 = await blogs.find({Email:result2.Email})
        console.log("Result2 is: "+result2)
        console.log("Result2 is: "+result1)
        req.session.opimg = result2.imagename
        res.render("otherprofile",{
            user: req.session.name, 
            pimg:  req.session.pimg,
            email: req.session.email,
            data2: result1,
            data3: result2,
            opimg: req.session.opimg
        })
    }catch(e){
        console.log(e);
    }
});
app.get('/profile1',auth, async (req, res) => {
    try{
        res.render("otherprofile",{
            user: req.session.name, 
            pimg:  req.session.pimg,
            email: req.session.email
        })
    }catch(e){
        console.log(e);
    }
});
app.get('/contact',auth, async (req, res) => {
    try{
        res.render("Contact",{
            user: req.session.name, 
            pimg:  req.session.pimg,
            email: req.session.email
        })
    }catch(e){
        console.log(e);
    }
});










app.post("/updateprofile",upload.single("imagename"),auth,async(req,res)=>{
    try{
        const pass = req.body.Password;
        const cpass = req.body.Cpassword;
        const result = await women.findOne({Email:req.session.email})
        const changedFilenmae = req.file.filename;
        if(pass!==cpass){
            res.render("update",{
                user: req.session.name, 
                pimg:  req.session.pimg, 
                email: req.session.email,
                alert5: result
            })
        }
        else{
            req.session.name = req.body.Name;
            req.session.pimg = changedFilenmae;
            req.session.email = req.body.Email;
            // const idVariable = new ObjectId(req.body.id);
            const idVariable = new mongooes.Types.ObjectId(req.body.id);
            const updated = await women.findByIdAndUpdate({_id:idVariable},{
                $set : {
                    Name: req.body.Name,
                    Email: req.body.Email,
                    Gender: req.body.Gender,
                    imagename: changedFilenmae,
                    Password: req.body.Password,
                    Cpassword: req.body.Cpassword
                }
            },{
                new: true,
                useFindAndModify: false 
            })
            const result  = await blogs.find({Email: req.user.Email}).sort({date: -1});
            res.render("profile",{
                user: req.session.name, 
                pimg:  req.session.pimg, 
                email: req.session.email,
                data: result
            })
        }
    }catch(e){
        console.log(e)
    }
})


app.post("/contact", auth, async (req,res)=>{
    try{
        const ContactDoc = new contact({
            Email : req.user.Email,
            textsms : req.body.textsms
        })
        const sms = await ContactDoc.save();
        console.log("Massege sent successfully:"+sms)
        res.render("index",{
            user: req.session.name, 
            pimg:  req.session.pimg,
            email: req.session.email
        })
    }catch(e){
        // res.status(500).send("<h1>Eroor found</h1>");
        console.log(e)
    }
})


app.get("/signup1",auth,async (req,res)=>{
    try{
        const record = await women.findOne({Email: req.session.email})
        res.render("signup",{
            user: req.session.name, 
            pimg:  req.session.pimg, 
            email: req.session.email,
            alert5: record
        })
    }catch(e){
        console.log(e);
    }
})
  
app.post("/registercontest",auth,async (req,res)=>{
    try{
        const contestdoc = new contest({
            Name: req.user.Name,
            Email: req.user.Email,
            Phone: req.body.Phone,
            Age: req.body.Age,
            Address: req.body.Address,
            Hearing: req.body.Hearing,
            Area: req.body.Area,
            Comments: req.body.Comments
        })
        const saved = await contestdoc.save()
        console.log(saved)
        res.render("index",{
            user: req.session.name, 
            pimg:  req.session.pimg,
            email: req.session.email
        })
    }catch(e){
        console.log(e);
    }
})


app.post('/sendqna',auth, async (req, res) => {
    try{
        const ansdoc = new ans1({
            Name: req.user.Name,
            Email: req.user.Email,
            imagename: req.user.imagename,
            Answer: req.body.Answer
        })
        const records = await AddQuery.find().sort({date: -1})
        const saved = await ansdoc.save();
        console.log(saved) 
        res.render("QNA",{
            user: req.session.name, 
            pimg:  req.session.pimg,
            email: req.session.email,
            qnar: records,
            sms1: true
        })
    }catch(e){
        console.log(e);
    }
});

app.get("/seeans",auth,async (req,res)=>{
    try{
        const ansr = await ans1.find().sort({data: -1})
        res.render("QNA2",{
            user: req.session.name, 
            pimg:  req.session.pimg,
            email: req.session.email,
            ansr1: ansr
        })
    }catch(e){
        console.log(e);
    }
})

app.get("/seecontest",auth,async (req,res)=>{
    try{
        res.render("contests",{
            user: req.session.name, 
            pimg:  req.session.pimg,
            email: req.session.email
        })
    }catch(e){
        console.log(e);
    }
})
app.get("/seecontest1",auth,async (req,res)=>{
    try{
        res.render("contests",{
            user: req.session.name, 
            pimg:  req.session.pimg,
            email: req.session.email,
            p1: true
        })
    }catch(e){
        console.log(e);
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