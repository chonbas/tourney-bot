/*

DISPUTE RESOLVER

Dispute resolver (N)
activate advancing handler
retrieve list of disputes from db (resolved ones are removed), resolve as innocent (maybe change later)

SPLIT: THIS "STARTS" A ROUND:
retrieve list of matches of round N+1 from Challonge
for each, create match chat
set timer for check-in resolver
activate match resolving handler
*/

var Console = require('../../../../util/console');
var prepare_round = null; //must break circular dependency

var resolver = (guild, round) => {
	var log_me = 'disputes resolver resolving';
	Console.log(log_me);

	if(prepare_round == null) {prepare_round = require('./prepare_round');}
	prepare_round(guild, round + 1);
};

module.exports = resolver;
