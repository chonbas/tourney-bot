var handler = {};

handler.handle_msg = (msg) => {
	msg.reply('run-tourney handler called');
};

module.exports = handler;