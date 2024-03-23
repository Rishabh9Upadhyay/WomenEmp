const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    Email : {
        type : String,
        required : true
    },
    textsms : {
        type : String,
        maxlength: 500,
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    }
})

const massage = new mongoose.model("Massage",contactSchema);

module.exports = massage;