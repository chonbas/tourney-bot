/**
This is responsible for creating a new team on Discord and adding it to the database.
*/

var Console = require('../../util/console');
const db = require('../../webservices/mongodb');
const challonge = require('../../webservices/challonge');
const discord = require('../../webservices/discord');

// eslint-disable-next-line
var addTeam = (msg, team_name) => {
	var guild = msg.guild;
	var guild_id = guild.id;
	var challonge_participant_id = null;
	var role_id = null;
	var team_mongo_id = null;

	return new Promise((fulfill, reject) => {
		var log_msg = 'Creating team ' + team_name;
		Console.log(log_msg);

		discord.setupNewTeam(guild, team_name)
		.then((ret_role_id) => {
			role_id = ret_role_id;
			return db.createTeam(guild_id, role_id, team_name);
		}).then((ret) => {
			team_mongo_id = ret;
			return challonge.createParticipant(guild_id, team_name); // Add team to challonge
		}).then((ret_participant_id) => {
			challonge_participant_id = ret_participant_id;
			Console.log('INSERTING HERE');
			Console.log(team_mongo_id);
			Console.log(challonge_participant_id);
			return db.setTeamChallongeID(guild_id, team_mongo_id, challonge_participant_id);
		}).then(() => {
			Console.log('Added team');
			fulfill(); // if ok, fulfill with msg (next check needs msg)
		})
		.catch((err) => {
			Console.log('Failed to create team \n=====ERROR:=====');
			Console.log(err);
			Console.log('=====END ERROR=====');
			if (challonge_participant_id != null) {
				challonge.removeParticipant(guild_id, challonge_participant_id);
			}
			if (role_id != null) {
				db.removeTeam(guild_id, role_id);
			}
			reject(err); // if error, reject
		});
	});
};

module.exports = addTeam;
