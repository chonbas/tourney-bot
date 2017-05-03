// eslint-disable-next-line
var Console = require('../../util/console');
// eslint-disable-next-line
var db = require('../../webservices/mongodb');
// eslint-disable-next-line
var challonge = require('../../webservices/challonge');

// eslint-disable-next-line
var makeChallongeTourney = (msg) => {
	return new Promise((fulfill, reject) => {
		// TODO: make channels for tournament
		// note: be sure to update DB with channel id types, etc
		// note: db currently does not have function to do this
		Console.log('Made Challonge tournament (not implemented)');
		var challonge_id = 'GARBAGE';
		fulfill(challonge_id); // once channels are made, call this
		reject(); // if error, reject
	});
};

module.exports = makeChallongeTourney;
