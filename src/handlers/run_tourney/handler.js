/**
RUN TOURNEY HANDLER

This handler delegates responsibility to the handlers
in handlers.

*/


const db = require('../../webservices/mongodb');
const constants = require('../../util/constants');
const Console = require('../../util/console');
var timer = require('./resolvers/timer');

var handlers = {};
handlers[constants.STATE_MATCH] = require('./handlers/match/handler');
handlers[constants.STATE_ADV_MATCH] = require('./handlers/advance/handler');
handlers[constants.STATE_DISPUTE] = require('./handlers/dispute/handler');
handlers[constants.STATE_ADV_DISPUTE] = require('./handlers/advance/handler');


var manager = {};
manager.handleMsg = (msg) => {
	Console.debug('Manager for run-tourney checking in');
	db.getTournamentRunState(msg.guild.id).then((status) => {
		Console.log('manager status ret:' + status);
		var handler = handlers[status];
		//check that handler has function before acting
		handler.handleMsg && handler.handleMsg(msg);
	});

	// TODO: remove this bs and make real
	if(msg.content.includes('done')){
		Console.log('tripping?');
		timer.trip(msg.guild.id);
	}

};

module.exports = manager;
