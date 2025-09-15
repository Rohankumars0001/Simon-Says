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
  const currUser = req.user || null;
  res.render("index", { currUser });
});
//login-------old user
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.send(err);
    if (!user) {
      // Authentication failed
      return res.redirect("/login");
    }
    req.login(user, (err) => {
      if (err) return next(err);
      console.log("success", "Welcome to Simon Says!");
      res.redirect("/");
    });
  })(req, res);
});
//signup--------new User
app.get("/signup", async (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        next(err);
      } else {
        console.log("jumped and logged!");
      }
      res.redirect("/");
    });
  } catch (err) {
    res.send(err);
  }
});
//logout
app.get("/logout", async (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (err) {
    res.send(err);
  }
});

//profile---view
app.get("/profile", async (req, res) => {
  res.render("profile");
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
