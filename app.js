require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const bcrypt = require("bcrypt");
const { connectToDB } = require("./models/db");
const saltRounds = bcrypt.genSaltSync(10);

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// express-session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

/**
 * passport.initialize() - a middleware function that integrate express.js application
 * to a popular user authentication library Passport.js.
 * It prepares Passport to handle authentication by attaching different methods like
 * req.login(), req.logout(), and req.isAuthenticated();
 */
app.use(passport.initialize());

/**
 * Tell the express application to use the Passport to setup up session
 */
app.use(passport.session());

connectToDB();

// Create register schema
const userSchema = new mongoose.Schema({
  name: String,
  password: String,
});

/**
 * @descirption: plugin() method is used to register plugin to schema
 */
userSchema.plugin(passportLocalMongoose);

// Create User model
const User = mongoose.model("User", userSchema);

/**
 * @method passport.use() method is used to configure a new authenticaiton strategy with passport
 *
 * @description: passport-local-mongoose adds a helper method createStrategy() as a static method to schema
 *
 */
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/secrets", function (req, res) {
  console.log("REQEUST => ", req.isAuthenticated());

  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

// app.get("/logout", function(req, res) {
//   req.logout();
//   res.redirect("/");
// });

app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    User.register({ username }, password, function (err, user) {
      if (err) {
        console.log("Error in register: => ", err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    });
  } catch (error) {
    console.log("Error in user registration: => ", error);
  }
});

app.post("/login", async function (req, res) {
  const { username, password } = req.body;
  const user = new User({ username, password });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
