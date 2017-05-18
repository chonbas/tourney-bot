var Console = require('../../util/console');
// eslint-disable-next-line
const db = require('../../webservices/mongodb');
var advanceTournamentChallonge = require('./advance_tournament_challonge');
const discord = require('../../webservices/discord');
var prepare_round = require('../run_tourney/resolvers/prepare_round/prepare_round');

// actually run tournament!!
var advanceTournamentStatus = (msg) => {
	var guild_id = msg.guild.id;
	advanceTournamentChallonge(msg).then(() => {
		return discord.transitionSetupToRun(msg.guild);
	}).then(() => {
		return prepare_round(msg.guild, 1);
	}).then(() => {
		return db.advanceTournamentState(guild_id);
	}).catch((err) => Console.log(err));
};

module.exports = advanceTournamentStatus;
