/**
DISPUTE HANDLER

This is responsible for resolving disputes

*/

var constants = require('../../util/constants');
var db = require('../../webservices/mongodb');
const discord = require('../../webservices/discord');
const challonge = require('../../webservices/challonge');
var Console = require('../../util/console');

var resolve_dispute = (msgRxn, user) => {
	return new Promise((fulfill, reject) => {
		var guild_id = msgRxn.message.guild.id;
		var num_teams = 0;
		var counts = {};
		var yays = 0;
		var nays = 0;
		var winner_discord_id = null;
		var match_id = null;
		var scores = '1-0';
		var winner_team_id = null;

		challonge.getMatchList(guild_id)
		.then((matches) => {
			var open_matches = matches.filter((m) => { return m.state == 'open';});
			num_teams = open_matches.length * 2;
			return discord.receiveDisputeChannelVote(msgRxn, user);
		})
		.then((votes) => {
			var originator_id = votes.payload.original_payload.originator_id;
			var defendant = votes.payload.original_payload.defendant_id;
			var defendant_id = defendant.replace(/\</, '');
			defendant_id = defendant_id.replace(/\@/, '');
			defendant_id = defendant_id.replace(/\>/, '');
			match_id = votes.payload.original_payload.challonge_match_id;

			counts = votes.payload.counts;
			yays = counts[constants.EMOJI_YES] + 1;
			nays = counts[constants.EMOJI_NO] + 1;
			if ((yays + nays) >= (num_teams / 3)) {
				if (yays > nays) {
					winner_discord_id = originator_id;
				} else {
					winner_discord_id = defendant_id;
				}
				db.getParticipantTeamID(guild_id, winner_discord_id)
				.then((winner_role_id) => {
					return db.getTeamChallongeID(guild_id, winner_role_id);
				})
				.then((winner_challonge_id) => {
					winner_team_id = winner_challonge_id;
					return db.getTeamNameByChallongeID(guild_id, winner_team_id);
				})
				.then((team_name) => {
					return msgRxn.message.channel.send('This dispute has been resolved. Congrats ' + team_name + '! You are moving on.');
				})
				.then(() => {
					fulfill({
						guild_id,
						match_id,
						winner_team_id,
						scores
					});
				}).catch(err => {
					Console.log(err);
					reject(err);
				});
			}
		}).catch(err => {
			Console.log(err);
			reject(err);
		});
	});
};

module.exports = resolve_dispute;