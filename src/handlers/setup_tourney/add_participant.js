/**
This file is like the grand-poppy of all the add participant stuff.
*/

var Console = require('../../util/console');
const db = require('../../webservices/mongodb');
const discord = require('../../webservices/discord');

// eslint-disable-next-line
var addParticipant = (guild, discord_id, team_name) => {
	var guild_id = guild.id;
	var team_id = null;

	return new Promise((fulfill, reject) => {

		db.getTeamIDByName(guild_id, team_name)
		.then((t) => {
			team_id = t;
			return db.createParticipant(guild_id, team_name, discord_id, team_id);
		})
		.then(() => {
			return db.getTeamRoleID(guild_id, team_id);
		}).then((role_id) => {
			return discord.setupAddToTeam(guild, discord_id, role_id);
		})
		.then(() => {
			Console.log('Added participant');
			fulfill(team_name);
		})
		.catch((err) => {
			Console.log('Failed to add participant \n=====ERROR:=====');
			Console.log(err);
			Console.log('=====END ERROR=====');
			db.removeParticipant(guild_id, discord_id);
			reject(err); // if error, reject
		});
	});
};

module.exports = addParticipant;
