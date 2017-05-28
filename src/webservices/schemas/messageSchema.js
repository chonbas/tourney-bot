var mongoose = require('mongoose');

var message_schema = new mongoose.Schema({
	msg_id: { //Role ID within Discord server
		type: String,
		index: true
	},
	msg_type: String,
	msg_creator: String,
	msg_recipients: String
});

var Message = mongoose.model('Message', message_schema);

module.exports = {'Message':Message};
