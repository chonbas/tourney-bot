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
const discord = require('../../webservices/discord');
var handler = {};

var advanceTournamentStatus = (msg) => {

	db.createTournament(msg.guild.id).then(() => {
		db.createStagedTourney(msg.guild.id).then( () =>{
			return discord.transitionNoToInit(msg.guild, msg.author);
		})
		.then((init_channel) => {
			Console.log(init_channel.name);
			return init_channel.send('<@'+msg.author.id + '> Let us get started! What would you like to name the tournament?');
		})
		.catch(err => Console.log(err));
	})
	.catch(err => Console.log(err));
};

handler.handleMsg = (msg) => {
	Console.log(msg.parsed_msg);
	msg.reply('no tourney handler handling');
	// TODO: detect if someone wants to create a tournament
	var done = (msg.parsed_msg.parse == parser_constants['CREATE_TOURNEY']);
	if (done) {
		Console.log('no tourney handler heard "done", advancing to next');
		advanceTournamentStatus(msg);
	}
};


module.exports = handler;
