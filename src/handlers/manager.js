const db = require('../webservices/mongodb');
const constants = require('../util/constants');
// eslint-disable-next-line
const Console = require('../util/console');

var handlers = {};
handlers[constants.NO_TOURNEY] = require('./no_tourney/handler');
handlers[constants.INIT_TOURNEY] = require('./init_tourney/handler');
handlers[constants.SETUP_TOURNEY] = require('./setup_tourney/handler');
handlers[constants.RUN_TOURNEY] = require('./run_tourney/handler');
handlers[constants.CLOSE_TOURNEY] = require('./close_tourney/handler');


var manager = {};
manager.distributeMsg = (msg) => {
	db.getTournamentStatus(msg.guild.id).then((status) => {
		var handler = handlers[status];
		//check that handler has function before acting
		handler.handleMsg && handler.handleMsg(msg);
	});
};

manager.distributeReaction = (msgReaction, user) => {
	db.getTournamentStatus(msgReaction.message.guild.id).then((status) => {
		var handler = handlers[status];
		//check that handler has function before acting
		handler.handleReaction && handler.handleReaction(msgReaction, user);
	});
};

module.exports = manager;
