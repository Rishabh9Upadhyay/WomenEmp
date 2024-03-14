const mongoose = require("mongoose");
const validator = require("validator")
const blogSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("Email error");
            }
        }
    },
    imagename:{
        type: String,
        required: true
    },
    blogcontent:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

const blogs = new mongoose.model("Blog",blogSchema);

module.exports = blogs;