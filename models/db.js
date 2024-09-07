const mongoose = require("mongoose");

// Connect to MongoDB with mongoose ODM
const connectToDB = async () => {
  const uri = process.env.MONGO_URI;
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB Successfully");
  } catch (error) {
    console.log("DATABASE CONNECTION ERROR: => ", error);
  }
};

module.exports = { connectToDB };
