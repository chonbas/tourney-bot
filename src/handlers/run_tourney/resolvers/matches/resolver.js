/*

MATCH RESOLVER

activate advancing handler
retrieve list of matches of round N from Challonge
for each match:
if completed, do nothing
if incomplete, kick both (maybe change later)
examine disputes list from db, for each dispute select jury and make channel
set timer for dispute completion
activate dispute resolving handler
*/

var Console = require('../../../../util/console');
var timer = require('../timer');
var dispute_resolver = require('../disputes/resolver');

var resolver = (guild, round) => {
	var log_me = 'matches resolver resolving';
	Console.log(log_me);

	timer.set(guild.id, () => {dispute_resolver(guild, round);});
};

module.exports = resolver;
