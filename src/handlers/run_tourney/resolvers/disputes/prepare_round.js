var Console = require('../../../../util/console');
var check_in_resolver = require('../check_in/resolver');
var timer = require('../timer');
var getMatches = require('../match_list_from_challonge');
var db = require('../../../../webservices/mongodb');

var prep = (guild, round) => {
// TODO: set handler to match-resolving
	Console.log('Preparing round ' + round);
	getMatches(guild, round).then((matches) => {
		// if no matches (i.e. the end of the tourney), end
		if(matches.length == 0) {
			Console.log('END: tournament at round ' + round);
			db.advanceTournamentState(guild.id);
		} else {
			// otherwise keep round-ing and such!
			timer.set(guild.id, () => {check_in_resolver(guild, round);});
		}
	}).catch();
};

module.exports = prep;
