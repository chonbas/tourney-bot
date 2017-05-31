/**
SETUP TOURNEY HANDLER
Once the tournament is designed/created, participants
are given time to join the tournament.

Thought: should there be a vote-to-start? or just timer-based?
Thought: use emitters built into discord to emit
event where timer goes off?
*/

// eslint-disable-next-line
var Console = require('../../util/console');
var parser_constants = require('../../util/parse_constants');
const db = require('../../webservices/mongodb');
const challonge = require('../../webservices/challonge');
const constants = require('../../util/constants');
var addTeam = require('./add_team');
var addParticipant = require('./add_participant');

var handler = {};

handler.handleMsg = (msg) => {
	var team_id = null;
// TODO: check for correct join-channel/other channels
	if (msg.parsed_msg.parse == parser_constants['JOIN_TOURNEY']) {
		msg.reply('Join a team or create one!');
		var fake_team_name = msg.content.split(' ')[2];
		db.getTeamIDByName(msg.guild.id, fake_team_name)
.then((ret_team_id) => {
	team_id = ret_team_id;
	if (team_id == constants['NO_TEAM']) {
		return addTeam(msg, fake_team_name);
	}
})
.then(() => {
	return addParticipant(msg, fake_team_name, team_id);
}).catch(err => Console.log(err));
	}

// TODO: Add transition function in Discord
	if(msg.parsed_msg.parse == parser_constants['START_TOURNEY']) {
		Console.log('HANDLER: Advancing from setup phase to running tourney phase');
		challonge.processTourneyCheckins(msg.guild.id)
.then(() => {
	return challonge.startTourney(msg.guild.id);
}).catch(err => Console.log(err));
	}
};

module.exports = handler;
