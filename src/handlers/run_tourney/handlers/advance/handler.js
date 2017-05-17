/*
ADVANCE HANDLER

just says "sorry am busy please let me resolve mah things, brb one minute"

*/

var Console = require('../../../../util/console');

var handler = {};

// eslint-disable-next-line
handler.handleMsg = (msg) => {
	msg.reply('Run-tourney/advance handler handling');
	Console.log('Run-tourney/advance handling (not implemented/stubbed)');
	// TODO: implement jury system kek
	// TODO: in the meantime just advance matches
};

module.exports = handler;
