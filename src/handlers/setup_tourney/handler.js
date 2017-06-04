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
const discord = require('../../webservices/discord');
var prepare_open_matches = require('../run_tourney/prepare_open_matches');

var handler = {};

var teamExists = (guild_id, team_name) => {
	return new Promise((fulfill, reject) => {
		db.getTeamIDByName(guild_id, team_name)
		.then((ret) => {
			if(ret == constants.NO_TEAM){
				fulfill(false);
			}
			fulfill(true);

		})
		.catch(err => reject(err));
	});
};

handler.handleMsg = (msg) => {
	var guild_id = msg.guild.id;
	// if we get a message to join the tournamnet
	if (msg.parsed_msg.parse == parser_constants['JOIN_TOURNEY']) {
		//parse out the team name
		var team_name = msg.content.split(' ')[2];
		Console.log('Team name' + team_name);
		db.getTourneyAvailability(guild_id)
		.then( res => {
			//check that tourney isnt full
			if (res.cap - res.cur > 0){
				//check that the team exists
				teamExists(guild_id, team_name)
				.then(exists => {
					if(exists){
						if (res.teams){
						//get confm to just add the person
							return db.getTeamIDByName(guild_id, team_name)
							.then((team_id) => {return db.getTeamCreatorByTeamID(guild_id, team_id);})
							.then((creator_id) => {return discord.sendConfirmJoinTeam(msg.channel, msg.author, creator_id, team_name);});
						} else {
							msg.reply('Sorry but joining teams is disabled for this tournament.');
						}
					} else {
						// make the team then add the person
						return addTeam(msg, team_name).then(() => {
							return addParticipant(msg.guild, msg.author.id, team_name);
						})
						.then(() => {msg.reply('I\'ve made you the owner of team ' + team_name + '!');})
						.catch(err => Console.log(err));
					}
				})
				.catch(err => Console.log(err));
			} else {
				msg.reply('I\'m sorry, but the tournament is at it\'s maximum capacity of ' + res.cap + ' total participants.');
			}

		}).catch( err=> Console.log(err));
	}

// TODO: Add transition function in Discord
	if(msg.parsed_msg.parse == parser_constants['START_TOURNEY']) {
		Console.log('HANDLER: Advancing from setup phase to running tourney phase');
		challonge.processTourneyCheckins(msg.guild.id)
		.then(() => {
			return challonge.startTourney(msg.guild.id);
		}).then(() =>{
			return db.advanceTournamentState(guild_id);
		}).then(() => {
			return prepare_open_matches(msg.guild);
		}).catch(err => Console.log(err));
	}
};

handler.handleReaction = (rxn, user) => {
	var new_teammate_id = null;
	var team_name = null;
	discord.receiveConfirmJoinTeam(rxn, user)
	.then((answer) => {
		Console.log(answer);
		if(answer.status == constants.EMOJI_YES) {
			new_teammate_id = answer.payload.new_teammate_id;
			team_name = answer.payload.team_name;
			return addParticipant(rxn.message.guild, new_teammate_id, team_name);
		} else if (answer.status == constants.EMOJI_NO){
			return rxn.message.channel.send('<@'+user.id + '> NOT added to ' + team_name +'.');
		}
	})
	.then((added) => {
		if(added) {
			return rxn.message.channel.send('<@'+ new_teammate_id+ '> added to ' + team_name +'.');
		}
	})
	.catch(err => Console.log(err));
};

module.exports = handler;
