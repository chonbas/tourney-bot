// eslint-disable-next-line
var Console = require('../../util/console');
// eslint-disable-next-line
var db = require('../../webservices/mongodb');
var parser_constants = require('../../util/parse_constants');

var updateChatState = (msg) => {
	return new Promise((fulfill, reject) => {
		// TODO: retrieve chat state - might need channelid??
		// TODO: update chat state with info
		// TODO: if done, set done to true

		msg.reply('init-tourney handler handling');
		if (msg.parsed_msg.parse == parser_constants['INIT_TOURNEY']){
			fulfill(true);
		}
		fulfill(false);
		reject(); // if error, reject
	});
};

module.exports = updateChatState;
