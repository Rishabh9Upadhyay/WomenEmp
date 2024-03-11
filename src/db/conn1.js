const mongoose = require("mongoose")
const url = "mongodb://127.0.0.1:27017/Womenempowerment"
mongoose.connect(url).then(()=>{
    console.log("Mongodb connected at port number 27017")
}).catch((e)=>{
    console.log(e)
})