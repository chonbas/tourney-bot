/**
This file is like the grand-poppy of all the add participant stuff.
*/

var Console = require('../../util/console');
var db = require('../../webservices/mongodb');
var challongeAddParticipant = require('./add_participant_challonge');
var discordAddParticipant = require('./add_participant_discord');

// eslint-disable-next-line
var addParticipant = (msg, participant_name) => {
	var guild_id = msg.guild.id;
	var username = participant_name + '_NAME'; //TODO: set to name
	var discord_id = participant_name + '_ID'; // TODO: set to user

	return new Promise((fulfill, reject) => {
		var log_msg = 'Adding participant ' + username;
		log_msg += ' with ID ' + discord_id;
		log_msg += ' ... (not implemented)';
		Console.log(log_msg);

		db.createParticipant(guild_id, username, discord_id).then(() => {
			return challongeAddParticipant(msg, participant_name);
		})
		.then(() => {
			return discordAddParticipant(msg);
		})
		.then(() => {
			Console.log('Added participant (not implemented)');
			fulfill(msg); // if ok, fulfill with msg (next check needs msg)
		})
		.catch((err) => {
			Console.log('Failed to add participant (not implemented)\n=====ERROR:=====');
			Console.log(err);
			Console.log('=====END ERROR=====');
			// TODO: also remove from challonge if discord problems
			db.removeParticipant(guild_id, discord_id);
			reject(); // if error, reject
		});
	});
};

module.exports = addParticipant;
