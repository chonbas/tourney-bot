var handler = {};

handler.handle_msg = (msg) => {
	msg.reply('close-tourney handler handled');
};


module.exports = handler;