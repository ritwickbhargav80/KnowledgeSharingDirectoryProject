const mongoose = require("mongoose");
const LikesSchema = mongoose.Schema({
	for: { type: String, required: true },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true},
});

module.exports = Like = mongoose.model('Likes', LikesSchema);
