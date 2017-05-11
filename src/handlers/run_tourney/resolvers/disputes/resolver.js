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
var resolveUnfinishedDisputes = require('./resolve_unfinished_disputes');
var resolveUnfinishedMatches = require('./resolve_unfinished_matches');
var getMatches = require('../match_list_from_challonge');

var resolver = (guild, round) => {
	// fix circular dependence
	if(prepare_round == null) {prepare_round = require('./prepare_round');}

	var log_me = 'disputes resolver resolving';
	Console.log(log_me);

	// TODO: set handler to advancing

	//resolve the disputes
	resolveUnfinishedDisputes(guild).then(() => {
	//retrieve the matches for round
		return getMatches(guild, round);
	}).then((matches) => {
		return resolveUnfinishedMatches(guild, matches, round);
	}).then(() => {
		prepare_round(guild, round + 1);
	}).catch((err) => {Console.log(err);});
};

module.exports = resolver;
