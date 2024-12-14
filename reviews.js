const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.creatReviews = async (req, res)=>{
    let listing =  await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
     newReview.author = req.user._id;
    listing.reviews.push(newReview);
 
    await newReview.save();
   await listing.save();
   req.flash("success",  "New Review Created ");
   
   res.redirect(`/listings/${listing._id}`);
   console.log("new reviews added in database");
  
 
 
 };



 module.exports.destroyReviews= async(req ,res) =>{
   let  {id ,reviewId} =req.params;
  await  Listing.findByIdAndUpdate(id, { $pull: {reviews: reviewId}});
  Review.findByIdAndDelete(reviewId);
 await req.flash("success" , "Review delete");
  res.redirect(`/listings/${id}`);


 };
 