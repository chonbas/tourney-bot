/*
These are utils for discord.js.

Do not require this file - use discord.js.
*/
var exports = {};
const Console = require('../../util/console');
//eslint-disable-next-line
const universals = require('../../util/constants');
//eslint-disable-next-line
const locals = require('./constants');


var getTeamStr = (guild_obj, role_id) => {
	var role_obj = guild_obj.roles.get(role_id);
	var ret = `<@&${role_obj.id}> (`;
	Console.log(ret);
	role_obj.members.forEach(m => {
		ret = ret + `<@${m.id}> `;
		Console.log(ret);
	});
	ret = ret.slice(0, -1) + ')';
	Console.log(ret);
	return ret;
};

/*
Stub is for temporary place-holding.
Call with whatever text and a note about what the message is for.
*/
exports.stub = (txt, todo) => {
	Console.log('DISCORD STR STUB CALLED: ' + todo);
	return txt;
};

exports.tourney_init_channel = (user) => {
	return `Hello ${user.username}!\n
	You're in charge of initializing the tournament, but don't worry - I've got you covered.\n
	By typing "doneski", I will create a Challonge tournament for you that other people can join.\n
	Blah blah blah. Yep!\n
	First off -- what would you like the tournament name to be?`;
};

exports.tourney_general_channel = () => {
	return `Hi everyone!\n
	This is the general tourney channel.`;
};

exports.tourney_announce_channel = (status) => {
	return `Hi everyone!\n
	This is the general tourney channel.
	${universals.ANNOUNCE_CHANNEL}
	Status: ${status}`;
};

exports.tourney_announce_winner = (winner_name, tourney_url) => {
	return `Congratulations ${winner_name} on winning the tournament!
You can check out the tournament bracket at: http://www.challonge.com/${tourney_url}`;
};

exports.tourney_match_channel = (guild, role_ids, match_number) => {
	var ppl = '';
	role_ids.forEach(r => {ppl += getTeamStr(guild, r) + '\n';});
	return `Hi match ${match_number}.
Contenders:
${ppl}
Good luck! Don't cheat!`;
};

module.exports = exports;
