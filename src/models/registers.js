const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

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
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
})


WomenSchema.methods.generateAuthToken = async function () {
    try {
        console.log("Here before jwt id: " + this._id);
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        console.log("This is token after jwt: " + token);
        return token;
    } catch (error) {
        console.error("The error in jwt is: ", error);
        throw error; // Re-throw the error to be handled in the calling function
    }
};

WomenSchema.pre("save",async function(next){
    if(this.isModified("Password")){
        console.log(`Current password is ${this.Password}`);
        this.Password = await bcrypt.hash(this.Password,10);
        console.log(`Current password is ${this.Password}`);
        this.Cpassword = await bcrypt.hash(this.Cpassword,10);
    }
    next();
})


const women = new mongoose.model("Womendata",WomenSchema)

module.exports = women;