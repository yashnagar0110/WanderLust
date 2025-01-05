const mongoose = require("mongoose");
const sampleListings = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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
  sampleListings.data = sampleListings.data.map((obj)=>({...obj,owner : "671634fc0ac5e68a5cab0562"}));
  await Listing.insertMany(sampleListings.data);
  console.log("data was initialized");
};

initDB();