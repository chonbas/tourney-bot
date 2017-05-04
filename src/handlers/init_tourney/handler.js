init = require('../initialize.js')

var handler = {};
//
handler.handleMsg = (msg) => {
	msg.reply('init-tourney handler handled')
	init.createTourney()
};


module.exports = handler;