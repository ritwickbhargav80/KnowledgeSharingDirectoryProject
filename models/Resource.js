const mongoose = require("mongoose");
const ResourcesSchema = mongoose.Schema({
  type: { type: String, required: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  source: { type: String, required: true },
  details: { type: String, required: true },
  img: { id: String, url: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now }
});

module.exports = Resource = mongoose.model("Resources", ResourcesSchema);

//change author to source
