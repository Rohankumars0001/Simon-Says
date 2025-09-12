const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user.js");

const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Session config (required for passport + flash)
const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

// Passport authentication setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware (make available in views)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/simonsays")
  .then(() => console.log("Connected to MongoDB!"));

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static assets
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.render("index"); // index.ejs should include the game logic script
});

// app.get("/login", (req, res) => {
//   res.render("login");
// });

app.get("/login", (req, res) => {
  res.render("login");
});

// Signup route
app.post("/signup", async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      console.log("success", "Welcome to Simon Says!");
      res.redirect("/");
    });
  } catch (err) {
    console.log(err.message);
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
