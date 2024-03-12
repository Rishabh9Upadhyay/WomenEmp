const mongoose = require("mongoose")
const validator = require("validator")

const WomenSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    Gender: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true
    },
    Cpassword:{
        type: String,
        required: true
    },
    imagename: {
        type: String,
        // required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const women = new mongoose.model("Womendata",WomenSchema)

module.exports = women;