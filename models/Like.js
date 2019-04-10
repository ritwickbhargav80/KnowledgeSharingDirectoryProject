const mongoose = require("mongoose");
const LikesSchema = mongoose.Schema({
	for: { type: String, required: true },
	user: { type: String, required: true},
});

module.exports = Like = mongoose.model('Likes', LikesSchema);
