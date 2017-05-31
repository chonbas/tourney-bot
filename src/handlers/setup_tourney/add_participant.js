/**
This file is like the grand-poppy of all the add participant stuff.
*/

var Console = require('../../util/console');
const db = require('../../webservices/mongodb');
const discord = require('../../webservices/discord');

// eslint-disable-next-line
var addParticipant = (guild, discord_id, team_name) => {
	Console.log(guild);
	var guild_id = guild.id;
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
			return discord.setupAddToTeam(guild, discord_id, role_id);
		})
		.then(() => {
			Console.log('Added participant');
			fulfill();
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
