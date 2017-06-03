/**
CLOSE TOURNEY HANDLER
After the game is over, ping owner of server and ask if they'd like
the bot to remove all related channels, etc.

Challonge.finalizeTourney()
Challongge.getWinner(guild_id)
Clean up all channels except tourney general 
(DB is taken care of when chat state advances)
Post winner in tourney general
PM server admin with confirmation about closing out tournament

*/

var handler = {};

handler.handleMsg = (msg) => {
	msg.reply('close-tourney handler handled');
};


module.exports = handler;
