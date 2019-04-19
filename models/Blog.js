const mongoose = require("mongoose");
const BlogsSchema = mongoose.Schema({
	category: { type: String, required: true },
	title: { type: String, required: true },
	details: { type: String, required: true },
	img: {id: String, url: String },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true},
	date: { type: Date, default: Date.now() }
});

module.exports = Blog = mongoose.model('Blogs', BlogsSchema);
