
const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const localStrategy=require('passport-local');
const User=require('./model/user');
const cors=require('cors');
const bodyParser = require("body-parser");




//Routes
const productRoutes=require('./route/product');
const authRoutes=require('./route/auth');
const cartRoutes=require('./route/cart');
const paymentRoutes=require('./route/payment');




app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());




//session configure
const sessionConfig={
    secret:'weneedsomebettersecret',
    resave:false,
    saveUninitialized:true
}

app.use(session(sessionConfig));
app.use(flash());


//initialize the passport and session
app.use(passport.initialize());
app.use(passport.session());

//configure the passport.
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//middleware for the flash.
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    next();
})
mongoose.connect('mongodb://localhost:27017/shopApp', 
{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify:false
})
.then(()=>{
    console.log("Database Connected");
})
.catch((e)=>{
    console.log("Error Occured");
})


//Routes Use.
app.use(productRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(paymentRoutes);


app.get('/',(req,res)=>{
    res.render('home');
})

app.listen(3000,()=>{
    console.log("Server listening at the port 3000");
})