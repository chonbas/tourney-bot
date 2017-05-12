var Console = require('../../util/console');
// eslint-disable-next-line
const db = require('../../webservices/mongodb');
var advanceTournamentChallonge = require('./advance_tournament');
var addParticipant = require('./add_participant');

// actually run tournament!!
var chatJoinChannel = (msg) => {
	if(msg.content.includes('join')) {
		var fake_id = msg.content.split(' ')[2];
		Console.log('HANDLER: Adding participant');

		var participant_name = fake_id | 'boop';
		participant_name = 'GARBAGE_USER_' + participant_name;
		addParticipant(msg, participant_name);
	}
	if(msg.content.includes('done')) {
		Console.log('HANDLER: Advancing from setup phase to running tourney phase');
		advanceTournamentChallonge(msg);
	}
};

module.exports = chatJoinChannel;
