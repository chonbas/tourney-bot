/**
SETUP TOURNEY HANDLER
Once the tournament is designed/created, participants
are given time to join the tournament.

Thought: should there be a vote-to-start? or just timer-based?
Thought: use emitters built into discord to emit
event where timer goes off?
*/

var Console = require('../../util/console');
// eslint-disable-next-line
const db = require('../../webservices/mongodb');
var addParticipant = require('./add_participant');
var advanceTournamentStatus = require('/advance_tournament');

var handler = {};

handler.handleMsg = (msg) => {
	msg.reply('setup tourney handler handling');
  // TODO: check for correct join-channel
	var join_channel = true;
	if(join_channel){
		addParticipant(msg)
		.then((msg) => {
			// TODO: change "done" trigger to init-tourney player's "start"
			var done = msg.content.includes('done');
			if (done) {
				Console.log('no tourney handler heard "done", advancing to next');
				advanceTournamentStatus(msg);
			}
		});
	}
};

// TODO: add other ways to start tournament (timer event? )


module.exports = handler;
