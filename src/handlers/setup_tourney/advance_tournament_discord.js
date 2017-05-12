// eslint-disable-next-line
var Console = require('../../util/console');
// eslint-disable-next-line
var db = require('../../webservices/mongodb');
// eslint-disable-next-line
var discord = require('../../webservices/discord');

// eslint-disable-next-line
var startTourneyDiscord = (msg) => {
	return new Promise((fulfill, reject) => {
		Console.log('Started running Discord tournament (not implemented)');

		// TODO: create channels? not sure
		// TODO: update announce to say tournament is running
		// TODO: message to join channel - can't accept new users
		// maybe also remove permissions


		fulfill(); // once channels are made, call this
		reject(); // if error, reject
	});
};

module.exports = startTourneyDiscord;
