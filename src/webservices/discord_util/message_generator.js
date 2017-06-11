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
You're in charge of initializing the tournament, but don't worry - I've got you covered.
Just answer these four questions about tournament name, type and size, and you will be ready to go!`;
};

exports.tourney_general_channel = () => {
	return `Hi everyone!\n
This is the general tourney channel where you can talk about what is going on in the tournament.
If you are looking to join the tournament, please head to the join-tourney channel to join the tournament!`;
};

exports.tourney_join_channel = () => {
	return `Hi everyone!\n
This is the join tourney channel where you can join or create a team in the tournament.
Let @tourney-bot know what you or team would like to be called during the tournament by messaging @tourney-bot followed by join or add and then the name.`;
};

exports.tourney_dispute_channel = () => {
	return `Hi everyone!\n
This is the dispute tourney channel where all of the vote kicks will be tallied.
If you see a new message appear in this channel, please head over and vote!\n
You can initiate a vote kick against another player for not showing up, cheating, etc. by messaging @tourney-bot report @player. Select the "check" to vote for the person who started the vote kick or the "X" if you think the other person is being unfairly targeted.`;
};


exports.tourney_announce_channel = (status) => {
	return `Hi everyone!\n
This is the announce tourney channel where you can check the state of the tournament.
Come back here to see who won!`;
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

exports.tourney_message_match_winner = (guild, role_id) => {
	var winner = getTeamStr(guild, role_id);
	return `Congratulations ${winner} on winning the match!`;
};

module.exports = exports;
