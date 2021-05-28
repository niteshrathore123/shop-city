const express=require('express');
const router=express.Router();
const {isLoggedIn}=require('../middleware');
const Product=require('../model/product');
const User = require('../model/user');

//getting the list of products in cart
router.get('/user/:userId/cart',isLoggedIn,async(req,res)=>{
    const user=await User.findById(req.params.userId).populate('cart');
    res.render('cart/showCart',{userCart:user.cart});
})

//add the product to the cart
router.post('/user/:id/cart',isLoggedIn,async(req,res)=>{
    const product=await Product.findById(req.params.id);
    const user=req.user;
    user.cart.push(product);
    await user.save();
    req.flash('success','Product added to cart successfully');
    res.redirect(`/user/${req.user._id}/cart`);
})

//delete the product from the cart.
router.delete('/user/:userId/cart/:pId',async(req,res)=>{
    const {userId,pId}=req.params;
    await User.findByIdAndUpdate(userId,{$pull:{cart:pId}});
    req.flash('success','Product removed from the cart');
    res.redirect(`/user/${req.user._id}/cart`);

})


module.exports=router;