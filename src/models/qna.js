const mongooes = require("mongoose")

const ansschema = new mongooes.Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    imagename: {
        type: String,
        required: true
    },
    Answer: String,
    date:{
        type: Date,
        default: Date.now()
    }
})

const ans1 = new mongooes.model("AnsQna",ansschema);

module.exports = ans1;