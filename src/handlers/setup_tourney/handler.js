/**
SETUP TOURNEY HANDLER
Once the tournament is designed/created, participants
are given time to join the tournament.

Thought: should there be a vote-to-start? or just timer-based?
Thought: use emitters built into discord to emit
event where timer goes off?
*/

// eslint-disable-next-line
var Console = require('../../util/console');
var chatJoinChannel = require('./chat_join_channel');

var handler = {};

handler.handleMsg = (msg) => {
	msg.reply('setup tourney handler handling');
  // TODO: check for correct join-channel/other channels
	var join_channel = true;
	if(join_channel){
		chatJoinChannel(msg);
	}
	// TODO: if wrong channel, send a help message or something
};

// TODO: add other ways to start tournament (timer event? )

module.exports = handler;
