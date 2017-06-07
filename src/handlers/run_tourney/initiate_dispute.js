/**

This is responsible for initiating disputes

*/

var db = require('../../webservices/mongodb');
const discord = require('../../webservices/discord');
var Console = require('../../util/console');

var initiate_dispute = (msg, defendant_id) => {
	return new Promise((fulfill, reject) => {
		var guild = msg.guild;
		var guild_id = guild.id;
		var originator_id = msg.author.id;
		var channel_id = msg.channel.id;
		var challonge_match_id = null;

		db.getChannelRefIDByChannelID(guild_id, channel_id)
		.then((c) => {
			challonge_match_id = c;
			return db.createDispute(guild_id, originator_id, defendant_id);
		}).then(() => {
			return discord.initiateDisputeVote(guild, originator_id, defendant_id, challonge_match_id);
		})
		.then(() => {
			Console.log('Initiated the dispute!');
			fulfill();
		}).catch(err => {
			Console.log(err);
			reject(err);
		});
	});
};

module.exports = initiate_dispute;