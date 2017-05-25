/*
These are utils for discord.js.

Do not require this file - use discord.js.
*/
var exports = {};
const Console = require('../../util/console');

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
	Blah blah blah. Yep!`;
};

exports.tourney_general_channel = () => {
	return `Hi everyone!\n
	This is the general tourney channel.`;
};

module.exports = exports;
