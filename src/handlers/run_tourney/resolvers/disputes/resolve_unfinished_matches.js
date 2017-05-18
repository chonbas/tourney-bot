// eslint-disable-next-line
var mongo = require('../../../../webservices/mongodb');
var Console = require('../../../../util/console');
var resolveMatchChallonge = require('./resolve_unfinished_match_challonge');
const discord = require('../../../../webservices/discord');

var resolve_matches = (guild, matches) => {
	return new Promise((fulfill, reject) => {
		Console.log('  Terminating matches for ' + guild.id);

		//promise array
		var actions = matches.map((match) => {
			// each action is a promise to resolve in challonge then discord
			return new Promise((fulfill, reject) => {
				resolveMatchChallonge(guild, match)
				.then(() => {
					discord.runResolveMatch(guild, match);
				})
				.catch(err => reject(err));
			});
		});

		//perform all promises before reporting we're done.
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
