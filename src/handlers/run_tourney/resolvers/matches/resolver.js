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
var getMatches = require('../match_list_from_challonge');
var notifyEndMatches = require('./notify_end_matches');
var initDisputeChannels = require('./init_dispute_channels');
var db = require('../../../../webservices/mongodb');

var resolver = (guild, round) => {
	var log_me = 'matches resolver resolving';
	Console.log(log_me);

	//get the matches
	db.advanceTournamentRunState(guild.id).then(() => {
		return getMatches(guild);
	}).then((matches) => {
	//tell matches it's over
		return notifyEndMatches(guild, matches);
	}).then(() => {
	//init disputes
		return initDisputeChannels(guild);
	}).then(() => {
	//advance
		return db.advanceTournamentRunState(guild.id);
	}).then(() => {
		//call next
		timer.set(guild.id, () => {dispute_resolver(guild, round);});
	}).catch((err) => {Console.log(err);});
};

module.exports = resolver;
