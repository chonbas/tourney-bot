/**
This file is like the grand-poppy of all the add participant stuff.
*/

var Console = require('../../util/console');
const db = require('../../webservices/mongodb');
const discord = require('../../webservices/discord');

// eslint-disable-next-line
var addParticipant = (msg, team_name) => {
	var guild = msg.guild;
	var guild_id = guild.id;
	var participant = msg.author;
	var discord_id = participant.id;
	var team_id = null;

	return new Promise((fulfill, reject) => {

		db.getTeamIDByName(guild_id, team_name)
		.then((t) => {
			team_id = t;
			return db.createParticipant(guild_id, team_name, discord_id, team_id);
		})
		.then(() => {
			Console.log('IDS HERE:');
			Console.log(guild_id);
			Console.log(team_id);
			return db.getTeamRoleID(guild_id, team_id);
		}).then((role_id) => {
			Console.log('DB returned role_id: ');
			Console.log(role_id);
			return discord.setupAddToTeam(guild, participant, role_id);
		})
		.then(() => {
			Console.log('Added participant');
			fulfill(msg); // if ok, fulfill with msg (next check needs msg)
		})
		.catch((err) => {
			Console.log('Failed to add participant \n=====ERROR:=====');
			Console.log(err);
			Console.log('=====END ERROR=====');
			db.removeParticipant(guild_id, discord_id);
			reject(); // if error, reject
		});
	});
};

module.exports = addParticipant;
