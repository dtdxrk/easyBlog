var mongoose = require('./connect_mongodb');

var UserSchema = new mongoose.Schema({
	ObjectId: mongoose.Schema.ObjectId,
	username: String,
	password: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;