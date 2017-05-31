var Console = require('../../util/console');
var db = require('../../webservices/mongodb');
const discord = require('../../webservices/discord');
const challonge = require('../../webservices/challonge');

var is_on_team = (guild, role_id, player_id) => {
	return !!guild.roles.get(role_id).members.get(player_id);
};

var report_winner_loser = (msg, author_is_winner) => {
	return new Promise((fulfill, reject) => {
		var guild_id = msg.guild.id;
		var channel_id = msg.channel.id;
		var reporter = msg.author;
		var team1_challonge_id = null;
		var team2_challonge_id = null;
		var team1_role_id = null;
		var team2_role_id = null;
		var challonge_match_id = null;
		//figure out which match
		db.getChannelRefIDByChannelID(guild_id, channel_id)
		.then((c) => {
			challonge_match_id = c;
			return challonge.getMatch(guild_id, challonge_match_id);
		})
		//get the team ids to determine which team reporter is on
		.then((match_obj) => {
			Console.log(match_obj);
			team1_challonge_id = match_obj.match.player1Id;
			team2_challonge_id = match_obj.match.player2Id;
			var promises = [
				db.getRoleIDByChallongeID(guild_id, team1_challonge_id),
				db.getRoleIDByChallongeID(guild_id, team2_challonge_id)
			];
			return Promise.all(promises);
		})
		.then((role_ids) => {
			team1_role_id = role_ids[0];
			team2_role_id = role_ids[1];
			var report_team_role_id = null;
			var report_team_challonge_id = null;
			var confirm_team_role_id = null;
			var confirm_team_challonge_id = null;
			if(is_on_team(msg.guild, team1_role_id, reporter.id)){
				report_team_role_id = team1_role_id;
				report_team_challonge_id = team1_challonge_id;
				confirm_team_role_id = team2_role_id;
				confirm_team_challonge_id = team2_challonge_id;
			}else if(is_on_team(msg.guild, team2_role_id, reporter.id)){
				report_team_role_id = team2_role_id;
				report_team_challonge_id = team2_challonge_id;
				confirm_team_role_id = team1_role_id;
				confirm_team_challonge_id = team1_challonge_id;
			}
			if(author_is_winner){
				return discord.sendConfirmMatchReport(msg.channel, reporter.id, confirm_team_role_id, {
					txt: 'they themselves won',
					winner_role_id: report_team_role_id,
					winner_challonge_id: report_team_challonge_id,
					loser_role_id: confirm_team_role_id,
					loser_challonge_id: confirm_team_challonge_id,
					challonge_match_id: challonge_match_id
				});
			}else{
				return discord.sendConfirmMatchReport(msg.channel, reporter.id, confirm_team_role_id, {
					txt: 'you guys won',
					winner_role_id: confirm_team_role_id,
					winner_challonge_id: confirm_team_challonge_id,
					loser_role_id: report_team_role_id,
					loser_challonge_id: report_team_challonge_id,
					challonge_match_id: challonge_match_id
				});
			}
		})
		.catch(err => reject(err));
	});
};

module.exports = report_winner_loser;
