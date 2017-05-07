/**
CLOSE TOURNEY HANDLER
After the game is over, ping owner of server and ask if they'd like
the bot to remove all related channels, etc.

thought: not really sure about details of this tbh lol
*/

var handler = {};

handler.handleMsg = (msg) => {
	msg.reply('close-tourney handler handled');
};


module.exports = handler;
