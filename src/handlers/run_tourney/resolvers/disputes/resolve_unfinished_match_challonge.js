// eslint-disable-next-line
var mongo = require('../../../../webservices/mongodb');
var Console = require('../../../../util/console');
var resolveMatchDiscord = require('./resolve_unfinished_match_discord');

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
		var had_to_resolve_match = true;
		if (had_to_resolve_match) {
			//this just
			resolveMatchDiscord(guild, match)
			.then(() => { fulfill(); })
			.catch(err => reject(err));
		} else {
			fulfill();
		}
	});
};

module.exports = resolve_match;
