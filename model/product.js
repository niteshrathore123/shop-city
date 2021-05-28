const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    image:{
        type:String
    },
    price:{
        type:Number,
    },
    desc:{
        type:String
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ]


})

const Product=mongoose.model('Product',productSchema);
module.exports=Product

