var Console = require('../../util/console');
// eslint-disable-next-line
const db = require('../../webservices/mongodb');
var advanceTournamentChallonge = require('./advance_tournament_challonge');

// actually run tournament!!
var advanceTournamentStatus = (msg) => {
	var guild_id = msg.guild.id;
	advanceTournamentChallonge(msg).then((match_data) => {
		// TODO: use match_data to initialize
	}).then(() => {
		// TODO: make DB actually reflect new state
		return db.getTournamentStatus(guild_id);
	});
	var log_msg = 'Advancing from setup phase to running tournament';
	msg.reply(log_msg);
	Console.log(log_msg);
};

module.exports = advanceTournamentStatus;
