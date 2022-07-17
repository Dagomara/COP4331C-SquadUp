const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    gameID: {type: Number, required:true},
    filters: {}
});

const UserSchema = new mongoose.Schema({
	discordID: {type: String, required: true},
	tag: {type: Number, required: true},
	username: {type: String, required: true},
	status: String,
	gender: {type: String, lowercase: true},
	school: String,
	games: [gameSchema],
	//reputation: {type: Number, required: true},
	friends: [Number],
	blocked: [Number]
});

module.exports = mongoose.model('User', UserSchema);