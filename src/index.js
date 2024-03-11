const express = require("express")
const app = express()
const port = process.env.PORT || 3000
require("./db/conn1")  
const hbs = require("hbs")
const path = require("path")

const template_path = path.join(__dirname,"../templates/views")
const partials_path = path.join(__dirname,"../templates/partials")
const static_path = path.join(__dirname,"../public")

app.use(express.static(static_path))
app.set("view engine","hbs")
app.set("views",template_path)
hbs.registerPartials(partials_path)


app.get("/",(req,res)=>{
    res.render("index") 
})  
app.get('/About',(req,res)=>{  
    res.render("About")
})  
app.listen(port,(err)=>{
    if(err){        
        console.log(err)
    }
    else{
        console.log(`Server is listning at port number ${port}`)
    }
})