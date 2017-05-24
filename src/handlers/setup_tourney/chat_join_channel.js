var Console = require('../../util/console');
// eslint-disable-next-line
const db = require('../../webservices/mongodb');
const challonge = require('../../webservices/challonge');
var addParticipant = require('./add_participant');

// actually run tournament!!
// TODO: check mondodb functions, to see which functions we need to create team / add teammate
var chatJoinChannel = (msg) => {
	// Change to parser
	// Create or join?
	// Need to add team to DB before Challonge is updated
	if(msg.content.includes('join')) {
		var fake_id = msg.content.split(' ')[2];
		Console.log('HANDLER: Adding participant');

		var participant_name = fake_id | 'boop';
		participant_name = 'GARBAGE_USER_' + participant_name;
		addParticipant(msg, participant_name);
	}

	// TODO: change to parser
	// TODO: add Discord transition fucntion
	if(msg.content.includes('done')) {
		Console.log('HANDLER: Advancing from setup phase to running tourney phase');
		challonge.processTourneyCheckins(msg.guild.id)
		.then(() => {
			return challonge.startTourney(msg.guild.id);
		}).catch(err => Console.log(err));
	}
};

module.exports = chatJoinChannel;
