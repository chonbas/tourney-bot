// eslint-disable-next-line
var Console = require('../../util/console');
// eslint-disable-next-line
var db = require('../../webservices/mongodb');

var updateChatState = (msg) => {
	return new Promise((fulfill, reject) => {
		// TODO: retrieve chat state - might need channelid??
		// TODO: update chat state with info
		// TODO: if done, set done to true

		msg.reply('init-tourney handler handling');
		if (msg.content.includes('done')){
			fulfill(true);
		}
		fulfill(false);
		reject(); // if error, reject
	});
};

module.exports = updateChatState;
