const db = require('../webservices/mongodb');
const constants = require('../util/constants');
//
var handlers = {};
handlers[constants.NO_TOURNEY] = require('./no_tourney/handler');
handlers[constants.INIT_TOURNEY] = require('./init_tourney/handler');
handlers[constants.SETUP_TOURNEY] = require('./setup_tourney/handler');
handlers[constants.RUN_TOURNEY] = require('./run_tourney/handler');
handlers[constants.CLOSE_TOURNEY] = require('./close_tourney/handler');


var manager = {};
manager.distribute_msg = (msg) => {
	// never reply to bots
	if (msg.author.bot) return;
	var status = db.get_tournament_status();
	var handler = handlers[status];
	//check that handler has function before acting
	handler.handle_msg && handler.handle_msg(msg);
	
};

module.exports = manager;