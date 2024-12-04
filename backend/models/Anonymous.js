const mongoose = require("mongoose");

const AnonymousSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = new mongoose.model("Anonymous", AnonymousSchema);
