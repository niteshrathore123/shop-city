if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}
const express=require('express');
const router=express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");


var instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
});


router.post("/payments",(req,res)=>{
    const{amt}=req.body;
    console.log("/paymets par amount mil gya 0+"+amt);
    res.render("products/payment", { key: process.env.KEY_ID , amount:amt});
})
// router.get("/payments",(req, res) => {
//     res.render("products/payment", { key: process.env.KEY_ID });
// });
router.post("/api/payment/order", (req, res) => {
    params = req.body;
    instance.orders
    .create(params)
    .then((data) => {
        res.send({ sub: data, status: "success" });
    })
    .catch((error) => {
        res.send({ sub: error, status: "failed" });
    });
});
  
router.post("/api/payment/verify", (req, res) => {
    body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

    var expectedSignature = crypto
        .createHmac("sha256", process.env.KEY_SECRET)
        .update(body.toString())
        .digest("hex");
    console.log("sig" + req.body.razorpay_signature);
    console.log("sig" + expectedSignature);
    var response = { status: "failure" };
    if (expectedSignature === req.body.razorpay_signature)
        response = { status: "success" };
    res.send(response);
    res.redirect('/user/:userId/cart');
    
});










module.exports=router;
