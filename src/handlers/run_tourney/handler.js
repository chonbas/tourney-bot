/**
RUN TOURNEY HANDLER

This handler delegates responsibility to the handlers
in handlers.

*/
// eslint-disable-next-line
var Console = require('../../util/console');
var constants = require('../../util/constants');
var timer = require('./resolvers/timer');

var handler = {};

var subhandlers = {};
var dir = './handlers/';
subhandlers[constants.RECEIVING_MATCH_REPORTS] = require(dir + 'match/handler');
subhandlers[constants.RESOLVING_DISPUTES] = require(dir + 'dispute/handler');
subhandlers[constants.ADVANCING] = require(dir + 'advance/handler');

handler.handleMsg = (msg) => {
	msg.reply('run tourney handler handling');

	// TODO: determine state from db
	var state = constants.RECEIVING_MATCH_REPORTS;
	subhandlers[state].handleMsg && subhandlers[state].handleMsg(msg);

	// TODO: remove this bs and make real
	if(msg.content.includes('done')){
		Console.log('tripping?');
		timer.trip(msg.guild.id);
	}
};

// TODO: add other event handler passers (like reaction)

module.exports = handler;
