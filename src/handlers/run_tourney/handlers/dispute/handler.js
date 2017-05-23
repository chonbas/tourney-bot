/*
DISPUTE HANDLER

examines messages/events to detect consensus on a jury
removes dispute from list

*/

var Console = require('../../../../util/console');
var constants = require('../../../../util/constants');
// eslint-disable-next-line
var challonge = require('../../../../webservices/challonge');
var db = require('../../../../webservices/mongodb');


var handler = {};

// eslint-disable-next-line
handler.handleMsg = (msg) => {
	msg.reply('Run-tourney/dispute handler: someone wrote a message');
	// the message handler doesn't need to do anything, except maybe help messages
	// disputes are resolved by emoji reactions, so no need for much here
	Console.log('Run-tourney/dispute handling (not implemented/stubbed)');
};

// eslint-disable-next-line
handler.handleReaction = (msgRxn, user) => {
	var guild = msgRxn.message.guild;
	db.getChannelType(guild.id)
	.then((type) => {
		//eslint-disable-next-line
		if(type == constants.JURY_CHANNEL){

		}
	})
	.catch(err => Console.err(err));
	Console.log('Run-tourney/dispute handler: emoji reaction detected');
};

module.exports = handler;
