
/**
INIT TOURNEY HANDLER
Once a user has expressed interest in designing a tournament,
init-tourney handler extracts information about what kind of
tournament is desired. Once all the parameters about the tournament
have been decided, the handler creates the tournament on challonge
and sets up the server so that participants can join.
*/

var Console = require('../../util/console');
var db = require('../../webservices/mongodb');

var chat = require('./chat_state_handle');
var discord = require('../../webservices/discord');
const challonge = require('../../webservices/challonge');


var handler = {};

var advanceTournamentStatus = (tourney_params, msg) => {
	Console.log('Init tourney handler "done"; advancing to setup');
	// tournament and use db.setChallongeID() to set challonge ID
	challonge.createTourney(msg.guild.id, tourney_params)
	.then((challonge_id) => {
		Console.log('challonge_id: ' + challonge_id);
		return db.setTournamentChallongeID(msg.guild.id, challonge_id);
		// TODO return
	}).then(() => {
		return db.advanceTournamentState(msg.guild.id);
		// TODO return
	}).then(() => {
		return discord.transitionInitToSetup(msg.guild);
	}).catch(err => Console.log(err));
};

handler.handleMsg = (msg) => {
	chat(msg).then((data_status) => {
		Console.log(data_status);
		if (data_status.done) {
			advanceTournamentStatus(data_status.params, msg);
		}
	}).catch((err) => { Console.log(err); });

};


module.exports = handler;
