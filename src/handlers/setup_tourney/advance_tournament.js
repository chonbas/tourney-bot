var Console = require('../../util/console');
// eslint-disable-next-line
const db = require('../../webservices/mongodb');
var advanceTournamentChallonge = require('./advance_tournament_challonge');
var advanceTournamentDiscord = require('./advance_tournament_discord');

// actually run tournament!!
var advanceTournamentStatus = (msg) => {
	var guild_id = msg.guild.id;
	advanceTournamentChallonge(msg).then(() => {
		return advanceTournamentDiscord(msg);
	}).then(() => {
		return db.advanceTournamentState(guild_id);
	}).catch((err) => Console.log(err));
};

module.exports = advanceTournamentStatus;
