const db = require('../mongodb');
const constants = require('../util/constants');
var no_tourney_handler = require('./no_tourney/handler');
var init_tourney_handler = require('./init_tourney/handler');
var run_tourney_handler = require('./run_tourney/handler');
var close_tourney_handler = require('./close_tourney/handler');

var manager = {};
manager.distribute_msg = (msg) => {
	// never reply to bots
	if (msg.author.bot) return;

	switch(db.get_tournament_status()){
	case constants.NO_TOURNEY:
		no_tourney_handler.handle_msg(msg);
		break;
	case 1:
		init_tourney_handler.handle_msg(msg);
		break;
	case 2:
		run_tourney_handler.handle_msg(msg);
		break;
	case 3:
		close_tourney_handler.handle_msg(msg);
		break;
	default:
		msg.reply('hm something funny happened.');
		break;
	}
};

module.exports = manager;