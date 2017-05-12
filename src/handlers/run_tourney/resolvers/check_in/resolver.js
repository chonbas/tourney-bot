/*

CHECKIN RESOLVER

retrieve list of matches of round N from Challonge
for each match:
if one checked in, kick other
if neither checked in, kick both
set timer for match completion resolver
*/

var Console = require('../../../../util/console');
var timer = require('../timer');
var matches_resolver = require('../matches/resolver');

var resolver = (guild, round) => {
	var log_me = 'check-in resolver resolving';
	Console.log(log_me);

	timer.set(guild.id, () => {matches_resolver(guild, round);});
};

module.exports = resolver;
