const mongoose = require('mongoose');
//mongoose.set('debug', true);

const gameSchema = new mongoose.Schema({
    gameID: {type: Number, required:true},
    filters: {}
});

const UserSchema = new mongoose.Schema({
	discordID: {type: String, required: true},
	tag: {type: Number, required: true},
	username: {type: String, required: true},
	avatar: String,
	status: String,
	gender: String,
	school: String,
	games: [gameSchema],
	//reputation: {type: Number, required: true},
	friends: [String],
	blocked: [String]
}, { collection: 'Users' });

module.exports = mongoose.model('User', UserSchema);