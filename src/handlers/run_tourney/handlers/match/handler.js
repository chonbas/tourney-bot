/*
MATCH HANDLER

listens for checkins, sets matches to pending (makes them "live" in Challonge)
examines messages to report match scores
examines message to detect disputes
*/

var Console = require('../../../../util/console');

var handler = {};

// eslint-disable-next-line
handler.handleMsg = (msg) => {
	msg.reply('Run-tourney/match handler handling');
	Console.log('Run-tourney/match handling (not implemented/stubbed)');
	// TODO: implement jury system kek
	// TODO: in the meantime just advance matches
};

module.exports = handler;