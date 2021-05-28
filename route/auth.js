const express=require('express');
const router=express.Router();
const User=require('../model/user');
const passport=require('passport');
const multer=require('multer');


//definig storage for multer to store the images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/profile_images');
    },
    filename: function (req, file, cb) {
      cb(null,file.originalname);
    },
});

//upload images.
const upload=multer({
    storage:storage,
    limits:{
        fieldSize:1024*1024*5
    },
});

//get the registration form
router.get('/register',(req,res)=>{
    res.render('auth/signup');
})

//register the user
router.post('/register',upload.single('profile'),async(req,res)=>{
    try{
        const user=new User({username:req.body.username,email:req.body.email,role:req.body.role, profile:req.file.filename});
        const newUser=await User.register(user,req.body.password);
        req.flash('success','Registered Successfully');
        res.redirect('/products');
    }
    catch(e){
        console.log("Cannot create the User");
        res.redirect('/register');
    }
   
});

//getting the login form.
router.get('/login',(req,res)=>{
    res.render('auth/login');
});

//login functionality
router.post('/login', passport.authenticate('local', 
            { 
                failureRedirect: '/login',
                failureFlash:true
            }
    ),(req,res)=>{
        req.flash('success','Login Successfully');
        res.redirect('/products');
    }          
);

//logout
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','Logout Successfully');
    res.redirect('/login');
});

router.get('/profile',(req,res)=>{
    const profile=req.body.profile;
    res.render('user/profile',{profile});
});


router.get('/failed',(req,res)=>{
    res.send("Failed to login");
});
router.get('/good',(req,res)=>{
    res.send(`Welcome ${req.user.email}`);
})

module.exports=router;
