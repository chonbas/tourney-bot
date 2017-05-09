/*
ADVANCE HANDLER

just says "sorry am busy please let me resolve mah things, brb one minute"

*/

var Console = require('../../../../util/console');

var handler = {};

// eslint-disable-next-line
handler.handleMsg = (msg) => {
	msg.reply('run-tourney-court handler handling');
	Console.log('Run-tourney/court handling (not implemented/stubbed)');
	// TODO: implement jury system kek
	// TODO: in the meantime just advance matches
};

module.exports = handler;
