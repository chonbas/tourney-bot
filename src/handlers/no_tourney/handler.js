/**
NO TOURNEY HANDLER
This handler is called when the bot has been added, but no one
is trying to make a tournament yet. Once a user declares that
they want to make a tournament, the bot creates a channel so that
the init-tourney handler can proceed.

Thought: maybe create a role of "able to make tournament"
so server admin can control who sets up tournaments
*/

var Console = require('../../util/console');
var parser_constants = require('../../util/parse_constants');
const db = require('../../webservices/mongodb');
var handler = {};

var advanceTournamentStatus = (msg) => {
	db.createTournament(msg.guild.id);
	// TODO: create channel for tournament initialization
	// TODO: give only tourney init-er permission to talk in channel
	// TODO: in db, record channel exists so chat state can be recorded
};

handler.handleMsg = (msg) => {
	msg.reply('no tourney handler handling');
	// TODO: detect if someone wants to create a tournament
	var done = (msg.parsed_msg.parse == parser_constants['CREATE_TOURNEY']);
	if (done) {
		Console.log('no tourney handler heard "done", advancing to next');
		advanceTournamentStatus(msg);
	}
};


module.exports = handler;
