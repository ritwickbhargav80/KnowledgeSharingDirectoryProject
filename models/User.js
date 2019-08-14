const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleID: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  img: { type: String, required: true },
  role: { type: String, default: "student" }
});

module.exports = User = mongoose.model("User", UserSchema);
