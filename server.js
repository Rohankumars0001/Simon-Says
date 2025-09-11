const express = require("express");
const path = require("path");

const app = express();

// Tell Express where your EJS templates are
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (CSS, client JS)
app.use(express.static(path.join(__dirname, "public")));

// Route: homepage
app.get("/", (req, res) => {
  res.render("index");
  //   res.render("index"); // renders views/index.ejs
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
