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

var process_winner = (guild_id) => {
	return new Promise((fulfill, reject) => {
		challonge.finalizeTourney(guild_id)
		.then(() => {
			return challonge.getTourneyWinner(guild_id);
		}).then((winner) => {
			Console.log('Winner\'s name is ');
			Console.log(winner);
			// Print tourney url to TourneyGeneral
			return challonge.stashTourney(guild_id);
		}).then((tourney_url) => {
			Console.log('Your tournament can be found at: ');
			Console.log('http://challonge.com/' + tourney_url);
			return db.advanceTournamentState(guild_id);
		}).then(() => {
			fulfill();
		}).catch(err => {
			Console.log(err);
			reject(err);
		});
	});
};

module.exports = process_winner;