const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
	discordID	: {type: String, required: true},
	tag		: {type: Number, required: true},
	username	: {type: String, required: true},
	gender	: {type: String, lowercase: true},
	school	: Number,
	games		: [mongoose.SchemaTypes.ObjectId],
	reputation	: {type: Number, required: true},
	friends	: [Number],
	blocked	: [Number]
});

const DiscordUser = module.exports = mongoose.model('User', UserSchema);