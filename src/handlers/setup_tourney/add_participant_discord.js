var Console = require('../../util/console');
// eslint-disable-next-line
var db = require('../../webservices/mongodb');

// TODO: Determine what data is needed from NLP extraction
// and properly feed into this function.
// eslint-disable-next-line
var addParticipantDiscord = (msg, participant_name) => {
	return new Promise((fulfill, reject) => {
		// TODO: give user role, insert in db etc.
		Console.log('Added participant to Discord (not implemented)');

		// TODO: put role_id in db

		// pseudo-join: type "join"
		fulfill(msg); // if ok, fulfill - next piece needs message

		var err = 'Add to Discord failed because XYZ.';
		reject(err); // if fail, reject
	});
};

module.exports = addParticipantDiscord;
