// eslint-disable-next-line
var Console = require('../../util/console');
// eslint-disable-next-line
var db = require('../../webservices/mongodb');
// eslint-disable-next-line
var challonge = require('../../webservices/challonge');

// eslint-disable-next-line
var startChallongeTourney = (msg) => {
	return new Promise((fulfill, reject) => {
		// TODO: tell challonge to start the tournament

		Console.log('Started Challonge tournament (not implemented)');

		// TODO: determine what info we need/use for a round
		// fulfill with this info
		var match_data = 'MATCH_DATA_GARBAGE_LOL';
		fulfill(match_data); // once channels are made, call this
		reject(); // if error, reject
	});
};

module.exports = startChallongeTourney;
