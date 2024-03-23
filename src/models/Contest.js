const mongoose = require("mongoose")


const ContestSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Email:{
        type: String,
        required: true
    },
    Phone:{
        type: String,
        required: true
    },
    Age:{
        type: String,
        required: true
    },
    Address:{
        type: String,
        required: true
    },
    Hearing:{
        type: String,
        required: true
    },
    Area:{
        type: String,
        required: true
    },
    Comments: {
        type: String
    },
    data: {
        type: Date,
        default: Date.now()
    }
})


const contest = new mongoose.model("Contestdata",ContestSchema)
module.exports = contest;