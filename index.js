const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing =require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wonderful";
main()
.then((data)=>{
    console.log(data);
})
.catch((err) =>{ console.log(err)});

async function main() {
  await mongoose.connect(MONGO_URL);

  
}


const initDb = async ()=>{
    await Listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({...obj, owner: "672339f289fbb31c77cf0549"}));
    await Listing.insertMany(initData.data);
    console.log(" successfully data was insert");


};

initDb();