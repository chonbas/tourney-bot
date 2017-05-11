// eslint-disable-next-line
var mongo = require('../../../../webservices/mongodb');
var Console = require('../../../../util/console');
var resolveMatchChallonge = require('./resolve_unfinished_match_challonge');

var resolve_matches = (guild, matches) => {
	return new Promise((fulfill, reject) => {
		Console.log('  Terminating matches for ' + guild.id);

		//promise array
		var actions = matches.map((match) => {
			return resolveMatchChallonge(guild, match);
		});
		Promise.all(actions)
		.then(()=>{
			fulfill();
		})
		.catch((err) => {
			Console.log(err);
			reject();
		});
	});
};

module.exports = resolve_matches;
