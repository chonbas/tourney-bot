var Console = require('../../util/console');

var addParticipant = (msg) => {
	return new Promise((fulfill, reject) => {

		// TODO: NLP: figure out if we should add the person, and to what team
		Console.log('Parsed message for join (not implemented)');

		// pseudo-join: type "join"
		if(msg.content.includes('join')){
			// TODO: determine what info is actually neeeded for challonge-adding
			// and return fulfill(that info)
			fulfill(msg, 'PARTICIPANT_NAME_GARBAGE'); // if ok, fulfill with msg (next check needs msg)
		} else {
			var err = 'Message does not contain "join"; rejecting.';
			reject(err); // if error, reject
		}
	});
};

module.exports = addParticipant;
