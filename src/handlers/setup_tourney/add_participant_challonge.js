var Console = require('../../util/console');
// eslint-disable-next-line
var db = require('../../webservices/mongodb');

// TODO: Determine what data is needed from NLP extraction
// and properly feed into this function.
// eslint-disable-next-line
var addParticipantChallonge = (msg, participant_name) => {
	return new Promise((fulfill, reject) => {
		// TODO: Actually add to tournament.
		Console.log('Added participant to Challonge (not implemented)');

		// TODO: put challonge_id in db

		// pseudo-join: type "join"
		fulfill(msg); // if ok, fulfill - next piece needs message

		var err = 'Add to Challonge failed because XYZ.';
		reject(err); // if fail, reject
	});
};

module.exports = addParticipantChallonge;
