/**
CLOSE TOURNEY HANDLER
After the game is over, ping owner of server and ask if they'd like
the bot to remove all related channels, etc.

(DB is taken care of when chat state advances)
Clean up all tourney channels

*/

var Console = require('../../util/console');
var parser_constants = require('../../util/parse_constants');
// eslint-disable-next-line
const challonge = require('../../webservices/challonge');
const discord = require('../../webservices/discord');

var handler = {};

handler.handleMsg = (msg) => {
	Console.log(msg.parsed_msg.parse);
	if(msg.parsed_msg.parse == parser_constants.END_TOURNEY) {
		discord.deleteAllTourneyChannels(msg.guild)
		.then(() => {
			Console.log('Your tournament is all wrapped up!');
		})
		.catch(err => Console.log(err));
	}
};


module.exports = handler;
