const db = require('../webservices/mongodb');
const constants = require('../util/constants');
const Console = require('../util/console');
var client = require('../webservices/discord');

var handlers = {};
handlers[constants.NO_TOURNEY] = require('./no_tourney/handler');
handlers[constants.INIT_TOURNEY] = require('./init_tourney/handler');
handlers[constants.SETUP_TOURNEY] = require('./setup_tourney/handler');
handlers[constants.RUN_TOURNEY] = require('./run_tourney/handler');
handlers[constants.CLOSE_TOURNEY] = require('./close_tourney/handler');


var manager = {};
manager.distributeMsg = (msg) => {
	// never reply to bots
	if (msg.author.bot) return;
	// only respond to @bot mentions
	if (!msg.isMentioned(client.user)) {
		Console.debug('Message heard, but no @bot so not replying.');
		return;
	}

	var status = db.getTournamentStatus();
	var handler = handlers[status];
	//check that handler has function before acting
	handler.handleMsg && handler.handleMsg(msg);

};

module.exports = manager;
