const mongoose = require("mongoose");
const CommentsSchema = mongoose.Schema({
  for: { type: String, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now() }
});

module.exports = Comment = mongoose.model("Comments", CommentsSchema);
