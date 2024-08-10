const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();
dotenv.config();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

connectToDB();

// Create register schema
const userSchema = mongoose.Schema({
  name: String,
  password: String,
});

// Create User model
const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({
      name: username,
      password,
    });

    const savedUser = await newUser.save();
    if (savedUser) {
      res.render("secrets");
    } else {
      res.send("User does not created");
    }
  } catch (error) {
    console.log("Error on Registration: => ", error);
  }
});

app.post("/login", async function (req, res) {
  const { username, password } = req.body;
  try {
    const foundUser = await User.findOne({ name: username });

    if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      } else {
        console.log("The password you entered is not correct");
      }
    } else {
      console.log("USER NOT FOUND", username);
    }
  } catch (error) {
    console.log("Error in login", error);
  }
});

const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
