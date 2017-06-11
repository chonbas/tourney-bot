/**
CLOSE TOURNEY HANDLER
After the game is over, ping owner of server and ask if they'd like
the bot to remove all related channels, etc.

(DB is taken care of when chat state advances)
Clean up all tourney channels

*/

var Console = require('../../util/console');
var parser_constants = require('../../util/parse_constants');
const discord = require('../../webservices/discord');
// eslint-disable-next-line
const discord_notifications = require('../../webservices/discord_notifications');

var handler = {};

handler.handleMsg = (msg) => {
	Console.log(msg.parsed_msg.parse);
	if(msg.parsed_msg.parse == parser_constants.END_TOURNEY) {
		discord.deleteAllTourneyChannels(msg.guild);
		Console.log('Your tournament is all wrapped up!');
	}
	Console.log('msg author in close handler');
	Console.log(msg.author);
	// discord_notifications.notifyPlayer(msg.guild, msg.author.id, 'Thanks for using TourneyBot! Hope you enjoyed your tournament!');
};


module.exports = handler;
