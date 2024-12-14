
const User = require("../models/user.js");

 module.exports.renderSignUpForm =(req, res)=>{
    res.render("users/signup.ejs");
};


module.exports.signUP = async(req, res)=>{
    try{
        let {username , email , password} = req.body;
    const newUser = new User({username , email});
   const registerUser = await User.register(newUser , password);
   req.login(registerUser , (err)=>{
    if(err){
        return next(err);
    }
    req.flash("success" ," wellcome to this website!");
    res.redirect("/listings");
   });
  
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    };
   
};


module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.loginForm =(req ,res)=>{
    req.flash("success", "Wellcome Back to Your Account");
    let redirectUrl = res.locals.redirectUrl || "/listings";
   
    res.redirect(redirectUrl);


};

module.exports.logOutForm =(req, res ,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logout in this page");
        res.redirect("/listings");
    });
};