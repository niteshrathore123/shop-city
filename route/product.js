const express=require('express');
const router=express.Router();
const multer=require('multer');
const Product = require('../model/product');
const Review=require('../model/review');
const {isLoggedIn}=require('../middleware');

//define the storage for the images.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/product_images');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname);
    },
});

//upload the image
const upload=multer({
    storage:storage,
    limits:{
        fieldSize:1024*1024*5
    },
});

//get all the products
router.get('/products',async(req,res)=>{
    try{
        const products=await Product.find({});
        res.render('products/index',{products});
    }
    catch(e){
        req.flash('error','Cannot get all the Products');
        res.render('error');
    }
})

//getting the form for the new product
router.get('/products/new',isLoggedIn,(req,res)=>{
    res.render('products/new');
})
//create the new product
router.post('/products',upload.single('image'),async(req,res)=>{
    let product=new Product({
        name:req.body.name,
        image:req.file.filename,
        price:req.body.price,
        desc:req.body.desc
    });
    try{
        product=await product.save();
        req.flash('success','Product created successfully');
        res.redirect('/products');
    }
    catch(e){
        req.flash('error','Cannot create the Product');
        res.render('error');
    }
});

//find the particular product with the id.
router.get('/products/:id',isLoggedIn,async(req,res)=>{
    try{
        const product=await Product.findById(req.params.id).populate('reviews');
        res.render('products/show',{product});
    }
    catch(e){
        req.flash('error','Cannot find the Product');
        res.redirect('/error');
    }
});

//edit form for products.
router.get('/products/:id/edit',isLoggedIn,async(req,res)=>{
    const product=await Product.findById(req.params.id);
    res.render('products/edit',{product});
});

//editing the products.
router.patch('/products/:id',upload.single('image'),async(req,res)=>{
    try{
        await Product.findByIdAndUpdate(req.params.id,{
            name:req.body.name,
            image:req.file.filename,
            price:req.body.price,
            desc:req.body.desc
        });
        req.flash('success','Product Updated Successfully');
        res.redirect(`/products/${req.params.id}`);
    }
    catch(e){
        req.flash('error','Cannot Update  the Product');
        res.render('error');
    }
});

//delete the product.
router.delete('/products/:id',isLoggedIn,async(req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id);
        req.flash('success','Product Deleted Successfully');
        res.redirect('/products');
    }
    catch(e){
        req.flash('error','Cannot Delete the Product');
        res.render('error');
    }
})

//getting review a product.
router.post('/products/:id/review',isLoggedIn,async(req,res)=>{
    const product=await Product.findById(req.params.id);
    const review=new Review({
        user:req.user.username,
        rating:req.body.rating,
        comment:req.body.comment
    });
    product.reviews.push(review);
    await review.save();
    await product.save();
    res.redirect(`/products/${req.params.id}`);

});



//Error 
router.get('/error',(req,res)=>{
    
    res.status(404).render('error');
})

module.exports=router;