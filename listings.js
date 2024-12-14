const Listing = require("../models/listing.js");

module.exports.index = async (req, res)=>{
    const allListing= await Listing.find();
    res.render("index.ejs", {allListing});
  };



  module.exports.renderNewForm = (req, res)=>{
    res.render("new.ejs");
};



module.exports.showListing =  async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error",  " Listing you requested for does not exits ");
        res.redirect("/listings");
    }
    res.render("show.ejs",{listing});
};

module.exports.creatNewListing = async (req,res, next)=>{
          
    const newListing = new Listing(req.body.listing);
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.owner= req.user._id;
    newListing.image ={url ,filename};
    await newListing.save();
    req.flash("success",  " New listing created ");
    res.redirect("/listings");
    console.log("data save");

};


module.exports.destroyListing = async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success",  " Successfully Delete Listing  ");
    console.log(deletedListing);
    res.redirect("/listings");
};


module.exports.renderEditForm = async(req, res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id);

    res.render("edit.ejs", {listing});
};

module.exports.updateListing = async (req, res)=>{
    let {id} =req.params;
     let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

     if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        Listing.image ={url ,filename};
        await listing.save();

     }
     req.flash("success",  " Listing updated ");
      
    res.redirect(`/listings/${id}`);

};