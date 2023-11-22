const mongoose = require('mongoose')
const dotenv  = require('dotenv');
const  validator = require("validator")
require('dotenv').config();
mongoose.connect(process.env.MONGO)
.then((res)=>{
    console.log("connected")
})
.catch((e)=>{
    console.log(e)
})

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true
    },
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    mobile:{
        type:String,
        unique:true,
    },
    website:{
        type:String,
        unique:true
    },
    likes:[{
        like:{
            type:String,
            unique:true
        }
    }]
})

const UserModel = mongoose.model('usersproject',UserSchema)
module.exports = UserModel