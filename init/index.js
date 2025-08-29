//Adding sample listings to the database

const mongoose = require("mongoose");
const sampleListings = require("./data.js");
const Listing = require("../models/listing.js");
require('dotenv').config();
const MONGO_URL = ""; // MongoDB connection URL";

console.log(sampleListings);

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  sampleListings.data = sampleListings.data.map((obj)=>({...obj,owner : "6783cff3f961038d2758a7b0"}));
  const data = await Listing.insertMany(sampleListings.data).then(()=>{console.log("Sample listings added")}).catch((err)=>{console.log(err)});
  console.log(data);
  console.log("data was initialized");
};

initDB();