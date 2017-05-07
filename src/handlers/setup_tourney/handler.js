/**
SETUP TOURNEY HANDLER
Once the tournament is designed/created, participants
are given time to join the tournament.

Thought: should there be a vote-to-start? or just timer-based?
Thought: use emitters built into discord to emit
event where timer goes off?
*/

var handler = {};
//
handler.handleMsg = (msg) => {
	msg.reply('setup-tourney handler handling');
};


module.exports = handler;
