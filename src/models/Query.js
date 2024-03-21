const mongoose = require("mongoose");
const QuerySchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    
    imagename:{
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Quries:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const AddQuery = new mongoose.model("Querie",QuerySchema);

module.exports = AddQuery;