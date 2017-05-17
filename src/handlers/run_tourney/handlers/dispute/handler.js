/*
DISPUTE HANDLER

examines messages/events to detect consensus on a jury
removes dispute from list

*/

var Console = require('../../../../util/console');

var handler = {};

// eslint-disable-next-line
handler.handleMsg = (msg) => {
	msg.reply('Run-tourney/dispute handler handling');
	Console.log('Run-tourney/dispute handling (not implemented/stubbed)');
	// TODO: implement jury system kek
	// TODO: in the meantime just advance matches
};

module.exports = handler;
