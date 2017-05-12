var Console = require('../../util/console');
// eslint-disable-next-line
const db = require('../../webservices/mongodb');
var advanceTournamentChallonge = require('./advance_tournament_challonge');
var advanceTournamentDiscord = require('./advance_tournament_discord');
var prepare_round = require('../run_tourney/resolvers/disputes/prepare_round');

// actually run tournament!!
var advanceTournamentStatus = (msg) => {
	var guild_id = msg.guild.id;
	advanceTournamentChallonge(msg).then(() => {
		return advanceTournamentDiscord(msg);
	}).then(() => {
		return db.advanceTournamentState(guild_id);
	}).then(() => {
		prepare_round(msg.guild, 1);
	}).catch((err) => Console.log(err));
};

module.exports = advanceTournamentStatus;
