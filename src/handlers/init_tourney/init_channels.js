// eslint-disable-next-line
var Console = require('../../util/console');
// eslint-disable-next-line
var db = require('../../webservices/mongodb');

// eslint-disable-next-line
var createChannels = (msg) => {
	return new Promise((fulfill, reject) => {

		// TODO: make channels for tournament
		// note: be sure to update DB with channel id types, etc
		// note: db currently does not have function to do this
		Console.log('Created channels for setup (not implemented)');

		fulfill(); // once channels are made, call this
		reject(); // if error, reject
	});
};

module.exports = createChannels;
