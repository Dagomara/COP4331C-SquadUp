const mongoose = require('mongoose');

const gameSchema = new Schema({
    gameID: Number,
    filters: {}
});

const UserSchema = new mongoose.Schema({
	discordID: {type: String, required: true},
	tag: {type: Number, required: true},
	username: {type: String, required: true},
	gender: {type: String, lowercase: true},
	school: Number,
	games: [gameSchema],
	reputation: {type: Number, required: true},
	friends: [Number],
	blocked: [Number]
});

module.exports = mongoose.model('User', UserSchema);