const mongoose = require("mongoose");
const MessagesSchema = mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	subject: { type: String, required: true },
	details: { type: String, required: true },
	date: { type: Date, default: Date.now() },
	status: { type: String, required: true, default: 'received' }
});

module.exports = Message = mongoose.model('Messages', MessagesSchema);
