if(process.env.NODE_ENV != "production") {
  require("dotenv").config();
};


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing.js");
const path =require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsyns.js");
const { listingSchema }  = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const {isLoggedIn , isOwner} = require("./middelware.js");
const { saveRedirectUrl} = require("./middelware.js");
const controlarListing = require("./controlars/listings.js");
const controlarReviews = require("./controlars/reviews.js");
const controlarUser = require("./controlars/users.js");

const multer  = require('multer');
const {storage } =require("./configar.js");
const { rmSync } = require("fs"); 
const upload = multer({ storage});



const dbUrl = process.env.ALTASDB_URL;
// const dbUrl ='mongodb://127.0.0.1:27017/wonderful';



main()
.then((data)=>{
    console.log(data);
})
.catch((err) =>{ console.log(err)});

async function main() {
  await mongoose.connect(dbUrl);
 
};

app.set("view engin", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended :true}));
app.use(methodOverride ("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create ({
  mongoUrl: dbUrl,
  crypto :{
    secret: process.env.SECRET,
  },
  touchAfter: 24 *36000,
});

store.on("error" , ()=>{
  console.log("error in mongo session store" , err);
})
const sessionOPtion = {
     store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 7  * 24 * 60 * 60 * 1000,
        maxAge: 7  * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};





app.use(session(sessionOPtion));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res , next)=>{
   res.locals.successMsg = req.flash("success");
   res.locals.errorMsg = req.flash("error");
   res.locals.currUser = req.user;
   next();
});



// app.get("/", (req, res)=>{
//     res.send("hi i am root");
// });





// app.get("/demoUser" , async(req, res)=>{
//     let fackUser = new User({
//         email: "student@gmail.com",
//         username: "Ankur-yadav",
//     });

//   let registerUser = await  User.register(fackUser , "helloworld");
//    res.send(registerUser);
// });





/////////////////////////////////////////////////////////

// app.get("/testlisting", (req, res)=>{
//     const sampleListing = new Listing({
//         title : "new york",
//         description: "this is bes city",
    
//         price: 1200,
//         location: "Delli",
//         country: "india",

//     });
//     sampleListing.save().then((data)=>{
//         console.log(data);
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
//     res.send("data added");
// });




/////  validate listing ko use nahi kiya hai


// const validateListing = (req, res, next) =>{
//     let {error } = listingSchema.validate(req.body);
//     if(error)
//     {
//         res.render("error.ejs");
//         console.log("find err validation");
       
//     }else {
//         next();
//     }
// };



// index rout

app.get("/listings", wrapAsync(controlarListing.index));

  
  /// new rout listing

  app.get("/listings/new",isLoggedIn, controlarListing.renderNewForm);


  // show rout
  
  app.get("/listings/:id",wrapAsync(controlarListing.showListing));
  
  // creat new rout
   
  app.post("/listings", isLoggedIn, upload.single('listing[image]'), wrapAsync(controlarListing.creatNewListing));
  

  
  
  //// delete rout
  
  app.delete("/listings/:id",isLoggedIn, isOwner,wrapAsync(controlarListing.destroyListing));
  

  //show tha
  // edit rout
  
  app.get("/listings/:id/edit", isLoggedIn, isOwner, wrapAsync(controlarListing.renderEditForm));
  
  
  //// update listing rout
  
  app.put("/listings/:id", isLoggedIn , isOwner, upload.single('listing[image]'), wrapAsync(controlarListing.updateListing));



// reviwes rout 
//creat new request 

app.post("/listings/:id/reviews" , isLoggedIn, wrapAsync (controlarReviews.creatReviews));


/// Delete reviews rout 

app.delete("/listings/:id/reviews/:reviewId" , isLoggedIn , wrapAsync(controlarReviews.destroyReviews));

//////////////////////////////////////////////////////////////////////////////////////
//  new user signup page 
//// signup page started

app.get("/signup" ,  controlarUser.renderSignUpForm);



app.post("/signup" ,wrapAsync(controlarUser.signUP));

/// end signup page

//////////////////////////////////////////////////////////////////


///// user login page


app.get("/login" , controlarUser.renderLoginForm);


app.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true }), 
  controlarUser.loginForm);



////// end login page
/////////////////////////////////////////////////////////

/////// creat logout rout

app.get("/logout" , controlarUser.logOutForm);


// err define 
// yah server ko crash hone se rokta hai 

app.use((err, req, res, next)=>{
    res.render("error.ejs");
console.log("somthing went wrong ", err);
});


app.listen(8080 , ()=>{
    console.log("server started 8080");
});