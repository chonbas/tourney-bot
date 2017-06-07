/**
CLOSE TOURNEY HANDLER
After the game is over, ping owner of server and ask if they'd like
the bot to remove all related channels, etc.

Challonge.finalizeTourney()
Challongge.getWinner(guild_id)

Post winner in tourney general
PM server admin with confirmation about closing out tournament

*/

var Console = require('../../util/console');
// eslint-disable-next-line
const discord = require('../../webservices/discord');
const challonge = require('../../webservices/challonge');
const db = require('../../webservices/mongodb');

var process_winner = (guild) => {
	return new Promise((fulfill, reject) => {
		var guild_id = guild.id;
		var winner_name = null;
		challonge.finalizeTourney(guild_id)
		.then(() => {
			return challonge.getTourneyWinner(guild_id);
		})
		.then((winner_id) => {
			return db.getTeamNameByChallongeID(guild_id, winner_id);
		})
		.then((winner) => {
			winner_name = winner;
			return challonge.stashTourney(guild_id);
		})
		.then((tourney_url) => {
			// Send tourney winner to TourneyAnnounce
			// Send tourney url to TourneyAnnounce
			Console.log('Your tournament can be found at: ');
			Console.log('http://challonge.com/' + tourney_url);
			return discord.runAnnounceWinner(guild, winner_name, tourney_url);
		})
		.then(() => {
			return db.advanceTournamentState(guild_id);
		})
		.then(() => {
			fulfill();
		}).catch(err => {
			Console.log(err);
			reject(err);
		});
	});
};

module.exports = process_winner;