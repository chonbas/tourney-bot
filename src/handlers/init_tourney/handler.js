var handler = {};

handler.handle_msg = (msg) => {
	msg.reply('init-tourney handler handled');
};

module.exports = handler;