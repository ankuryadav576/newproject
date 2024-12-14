const mongoose =require("mongoose");
const Schema = mongoose.Schema;


const revievSchema = new Schema ({
   
    rating: {
        type: String,
        min: 1,
        max:5 
    },
    text: {
        type : String,
    },

    createdAt: {
        type: String,
        default: Date.now() 
    },
    author :{
        type: Schema.Types.ObjectId,
        ref :"User",
    },
});



 const Review = mongoose.model("Review", revievSchema);

module.exports= Review;