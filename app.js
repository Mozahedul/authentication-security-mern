const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
