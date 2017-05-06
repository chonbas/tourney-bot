/**
This file is like the grand-poppy of all the
*/

var Console = require('../../util/console');
// eslint-disable-next-line
var db = require('../../webservices/mongodb');
var parseForJoin = require('./add_participant_nlp');
var challongeAddParticipant = require('./add_participant_challonge');
var discordAddParticipant = require('./add_participant_discord');

// eslint-disable-next-line
var addParticipant = (msg) => {
	return new Promise((fulfill, reject) => {
		Console.log('Adding participant... (not implemented)');
		parseForJoin(msg)
		.then((msg, participant_name) => {
			return challongeAddParticipant(msg, participant_name);
		})
		.then((msg) => {
			return discordAddParticipant(msg);
		})
		.then((msg) => {
			Console.log('Added participant (not implemented)');
			fulfill(msg); // if ok, fulfill with msg (next check needs msg)
		})
		.catch((err) => {
			Console.log('Failed to add participant (not implemented)\n=====ERROR:=====');
			Console.log(err);
			Console.log('=====END ERROR=====');
			reject(); // if error, reject
		});
	});
};

module.exports = addParticipant;
