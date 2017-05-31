/**
This file is like the grand-poppy of all the add participant stuff.
*/

var Console = require('../../util/console');
const db = require('../../webservices/mongodb');
const discord = require('../../webservices/discord');

// eslint-disable-next-line
var addParticipant = (msg, fake_team_name, team_id) => {
	var guild = msg.guild;
	var guild_id = guild.id;
	var user = msg.guild.member;
	var participant_name = msg.author;
	var discord_id = participant_name.id;

	return new Promise((fulfill, reject) => {
		var log_msg = 'Adding participant ' + participant_name;
		log_msg += ' with ID ' + discord_id;
		Console.log(log_msg);

		db.createParticipant(guild_id, participant_name, discord_id, team_id)
.then(() => {
	return db.getTeamRoleID(guild_id, team_id);
}).then((role_id) => {
	return discord.setupAddToTeam(guild, user, role_id);
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
