const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');


const userSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        require:true
    },
    role:{
        type:String
    },
    profile:{
        type:String
    },
    cart:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ]
});

userSchema.plugin(passportLocalMongoose);
const User=mongoose.model('User',userSchema);
module.exports=User;


