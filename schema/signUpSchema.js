const mongoose = require("mongoose")

const signUpSchema = new mongoose.Schema({
    userName : {
        type: String,
        //  required: true
    },
    email :{
        type : String,
        required: true,
        unique: true
    },
    password:{
        type : String,
        required : true
    }
})


module.exports = signUpSchema