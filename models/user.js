const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // no need to store password manually, passport-local-mongoose adds it
});

// Add plugin → this gives User.authenticate(), serializeUser(), deserializeUser()
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
