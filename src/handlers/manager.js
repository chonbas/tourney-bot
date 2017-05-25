const db = require('../webservices/mongodb');
const constants = require('../util/constants');
// eslint-disable-next-line
const Console = require('../util/console');
const parseMessage = require('../util/parser');

var handlers = {};
handlers[constants.NO_TOURNEY] = require('./no_tourney/handler');
handlers[constants.INIT_TOURNEY] = require('./init_tourney/handler');
handlers[constants.SETUP_TOURNEY] = require('./setup_tourney/handler');
handlers[constants.RUN_TOURNEY] = require('./run_tourney/handler');
handlers[constants.CLOSE_TOURNEY] = require('./close_tourney/handler');



var manager = {};

manager.distributeMsg = (msg) => {
	if(msg.content.includes('PURGE')) {
		require('../webservices/discord').deleteAllTourneyChannels(msg.guild);
		return;
	}
	var tournament_status = null;
	// retrieve tournament status
	db.getTournamentStatus(msg.guild.id).then((status) => {
		tournament_status = status;
		return db.getChannelType(msg.guild.id, msg.channel.id);
	//retrieve channel type
	}).then((channel_type) => {
		//give info to parser and attach parsed info to msg object
		msg.parsed_msg = parseMessage(msg.content, tournament_status, channel_type);

		//TODO: check that handler has function before acting
		var handler = handlers[tournament_status];
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
