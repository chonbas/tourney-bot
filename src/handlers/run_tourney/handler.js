/**
RUN TOURNEY HANDLER

This handler delegates responsibility to the handlers
in handlers.

*/

const db = require('../../webservices/mongodb');
const constants = require('../../util/constants');
const Console = require('../../util/console');
const prep_round = require('./prepare_open_matches');

var handler = {};
handler.handleMsg = (msg) => {
	Console.debug('handler for run-tourney checking in');
	prep_round(msg.guild, 1);

};
handler.handleReaction = (msgRxn, user) => {
	Console.debug('handler for run-tourney: reaction detected!');
};

module.exports = handler;
