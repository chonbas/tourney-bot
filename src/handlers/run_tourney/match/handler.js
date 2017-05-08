var Console = require('../../util/console');

var handler = {};

handler.handleMsg = (msg) => {
	msg.reply('run-tourney-match handler handling');
	Console.log('Run-tourney/match handling (not implemented/stubbed)');
	// TODO: implement jury system kek
	// TODO: in the meantime just advance matches
};

module.exports = handler;
