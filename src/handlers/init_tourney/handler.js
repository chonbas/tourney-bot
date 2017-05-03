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
var channel_init = require('./init_channels');
var challonge_init = require('./challonge_make');

var handler = {};

var advanceTournamentStatus = (msg) => {
	Console.log('Init tourney handler "done"; advancing to setup');
	// TODO: initialize challonge
	// tournament and use db.setChallongeID() to set challonge ID
	challonge_init().then((challonge_id) => {
		Console.log('challonge_id: ' + challonge_id);
		db.setChallongeID(msg.guild.id, challonge_id);
		channel_init(msg);
	});
};

handler.handleMsg = (msg) => {
	chat(msg).then((advance) => {
		if (advance) {
			advanceTournamentStatus(msg);
		}
	}).catch((err) => { Console.log(err); });
};


module.exports = handler;
