const mongoose =require("mongoose");
const SettingsSchema =mongoose.Schema({
	for: { type: String, required: true },
	field: { type: String, required: true },
	value: { type: String, required: true },
});

module.exports = Setting = mongoose.model('Settings', SettingsSchema);
