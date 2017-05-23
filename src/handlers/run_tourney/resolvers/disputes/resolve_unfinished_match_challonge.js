// eslint-disable-next-line
var mongo = require('../../../../webservices/mongodb');
var Console = require('../../../../util/console');

/**
Forces resolution of an match.
First, it check that the match is incomplete.
If incomplete, it randomly picks a winner.
Fullfills with a boolean stating if the match
had to be resolved (thus requiring a message in
Discord notifying the users) and the match in question.
*/
var resolve_match = (guild, match) => {
	return new Promise((fulfill, reject) => {
		Console.log('      Resolving match in Challonge  ' + match + ' for ' + guild.id);
		// TODO: get match in Challonge
		// TODO: if match isn't resolved, resolve it.
		// TODO: actually set these variables

        // eslint-disable-next-line
		var had_to_resolve_match = true;
		fulfill();
		reject();
	});
};

module.exports = resolve_match;
