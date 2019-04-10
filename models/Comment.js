const mongoose = require("mongoose");
const CommentsSchema = mongoose.Schema({
	for: { type: String, required: true },
	comment: { type: String, required: true },
	user: { type: String, required: true},
	date: { type: Date, default: Date.now() }
});

module.exports = Comment = mongoose.model('Comments', CommentsSchema);
