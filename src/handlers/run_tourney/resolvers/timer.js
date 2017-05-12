/*

TIMER

SetTimeout wrapper
*/

var Console = require('../../../util/console');

var timer = {};

timer.timeouts = {};

timer.set = (guild_id, cb, time=8000) => {
	var log_me = 'timer set!';
	Console.log(log_me);
	var t = setTimeout(cb, time);
	timer.timeouts[guild_id] = [t , cb];
};

timer.trip = (guild_id) => {
	var log_me = 'timer tripped!!';
	Console.log(log_me);
	var dat = timer.timeouts[guild_id];
	clearTimeout(dat[0]);
	dat[1]();
};

module.exports = timer;
