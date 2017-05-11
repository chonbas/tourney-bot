var mongoose = require('mongoose');
var constants = require('../util/constants');
const Console = require('../util/console');
var Guild = require('./schemas/guildSchema.js');
// eslint-disable-next-line
var challongeclient = require('./challonge');

var exports = {};


//initialize database, and report access
mongoose.connect(constants['DATABASE_ADDRESS']);
var db = mongoose.connection;
mongoose.set('debug', true);
db.on('error', (err) =>{
	Console.error.bind(Console, 'connection error:');
	Console.log(err);
	Console.log('\n\nYou must be running MongoDB. If you are, check the error above for more information.');
});
db.once('open', () => {
	Console.log('Connected to MongoDB.');
});


/* createTournament(guild_id)
 * -------------------------------------------------------
 * Takes guild_id and first checks if the guild is already
 * in the db -- if it is, then fulfill with NO_TOURNEY as each
 * guild can only have one active tourney.
 * If no guild found, attempt to create new tourney and set
 * its state to INIT_TOURNEY to start. If an error occurs
 * during creation, the promise is rejected with the error.
 * Returns: Promise -- On succesful fulfill returns CREATE_SUCCESS.
 * Usage:
 * db.createTournament(guild_id).then( (guild_id) =>{
 * 		//DO STUFF
 * }).catch((err)=>{
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.createTournament = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id: guild_id,
		}).then( (guild_obj) =>{
			if (!guild_obj){
				Guild.create({
					guild_id: guild_id,
					tourney_state: constants.INIT_TOURNEY
				}).then( () => {
					Console.log('Guild with guild_id:' + guild_id + ' created');
					fulfill(constants.CREATE_SUCCESS);
				}).catch( (err)=>{
					Console.log(err);
					reject(err);
				});
			}else {
				Console.log('Guild already exists.');
				fulfill(constants.NO_TOURNEY);
			}
		}).catch((err)=>{
			Console.log(err);
			reject(err);
		});

	});
};

/* deleteTournament(guild_id)
 * -------------------------------------------------------
 * Takes guild_id and first tries to find tournament in db,
 * if guild is found, the tournament is removed. If guild
 * is not found, the promise fulfills and returns NO_TOURNEY.
 * If the remove operation fails, promise rejects
 * and error is returned.
 * 
 * Returns: Promise - On succesful fulfill returns UPDATE_SUCCESS.
 * Usage:
 * db.deleteTournament(guild_id).then((status)=>{
 * 		//DO STUFF
 * }).catch((err)=>{
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.deleteTournament = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id: guild_id,
		}).then( (guild_obj) => {
			if (!guild_obj){ fulfill(constants.NO_TOURNEY); } 
			guild_obj.remove().then( () => {
				fulfill(constants.REMOVE_SUCCESS);
			}).catch( (err) => {
				Console.log(err);
				reject(err);
			});
		}).catch((err)=>{
			Console.log(err);
			reject(err);
		});
	});
};

/* setChallongeID(guild_id, challonge_id)
 * -------------------------------------------------------
 * Attempts to find the guild with the given id, if
 * guild not found, fulfills with NO_TOURNEY. Else 
 * the challonge id is set and and the guild is updated.
 * If the update is succesful, the promise fulfills with
 * UDPATE_SUCCESS, else rejected with error message.
 * Returns: Promise -- On successful fulfill UPDATE_SUCCESS
 * 
 * Usage:
 * db.setChallongeID(guild_id, challonge_id).then( (status)=>{
 * 		//DO STUFF
 * }).catch((err)=>{
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.setChallongeID = (guild_id, challonge_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id: guild_id,
		}).then( (guild_obj) => {
			if (!guild_obj){ fulfill(constants.NO_TOURNEY); }
			guild_obj.challonge_id = challonge_id;
			guild_obj.save().then( () =>{
				Console.log('ChallongeID set to:' + challonge_id +' for guild with id:' + guild_id);
				fulfill(constants.UPDATE_SUCCESS);
			}).catch(function(err){
				Console.log(err);
				reject(err);
			});
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getChallongeID(guild_id)
 * -------------------------------------------------------
 * Attempts to find the guild with the given id,
 * and if that guild's challonge id is not null, the promise
 * is fulfilled and the challonge id is returned.
 * If tourney not found, fulfill with NO_TOURNEY.
 * NOTE:If ChallongeID is null, fulfill will be null.
 * If any error occurs, the promise will be rejected.
 * Returns: Promise -- On successful fulfill returns challonge ID.
 * Usage:
 * db.getChallongeID(guild_id).then( (challonge_id) =>{
 * 		//DO STUFF
 * }).catch( (err) =>{
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getChallongeID = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id: guild_id,
		}).then( (guild_obj) => {
			if (!guild_obj){ fulfill(constants.NO_TOURNEY); } 
			var challonge_id = guild_obj.challonge_id;
			fulfill(challonge_id);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getTournamentStatus(guild_id)
 * -------------------------------------------------------
 * Attempts to find guild with the given id,
 * if no tourney found fulfills with NO_TOURNEY.
 * If tourney is found, fulfills with current tourney_state.
 * If any error occurs during retrieval, rejects with error.
 * 
 * Returns: Promise -- On success returns tourney state
 * Usage:
 * db.getTournamentStatus(guild_id).then( (tourney_state){
 * 		//DO STUFF
 * }).catch((err)=>{
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getTournamentStatus = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id: guild_id
		}).then((guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY); } 
			var tourney_state = guild_obj.tourney_state;
			fulfill(tourney_state);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getTournamentRunningStatus(guild_id)
 * -------------------------------------------------------
 * Attempts to find guild with the given id,
 * if no tourney found fulfills with NO_TOURNEY.
 * If tourney is found, checks the state of the tourney,
 * if the tourney is in RUN_TOURNEY,
 * fulfills with current sub state of tournament.
 * If tourney is not in RUN_TOURNEY, fulfills with
 * null.
 * If any error occurs during retrieval, rejects with error.
 * 
 * Returns: Promise -- On success returns tourney state
 * Usage:
 * db.getTournamentStatus(guild_id).then( (tourney_state){
 * 		//DO STUFF
 * }).catch((err)=>{
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getTourneyRunState = (guild_id) => {
	return new Promise( (fulfill, reject) => {
		Guild.findOne({
			guild_id: guild_id
		}).then( (guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY); } 
			var tourney_state = guild_obj.tourney_state;
			if (tourney_state === constants.RUN_TOURNEY){
				fulfill(guild_obj.tourney_sub_state);
			} else {
				fulfill(null); // If tourney not in run state, return null
			}
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* advanceTournamentState(guild_id)
 * -------------------------------------------------------
 * Attempts to find guild with given guild_id,
 * if any errors occur during tourney retrieval
 * or update the promise is rejected.
 * If the guild is not found, fulfills with NO_TOURNEY.
 * If a guild is found in its final state
 * the guild is removed and fulfills with status passed from
 * delete tournament (successful when REMOVE_SUCCESS).
 * Otherwise, the tourney state is advanced to the next stage
 * and UPDATE_SUCCESS is returned.
 * 
 * Returns- Promise, On successful fulfill UPDATE_SUCCESS
 * Usage:
 * db.advanceTournamentState(guild_id).then( (status) => {
 * 		//DO STUFF!
 * }).catch( (err) => {
 * 		/error handling
 * });
 * -------------------------------------------------------
*/
exports.advanceTournamentState = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY);}
			var current_state = guild_obj.tourney_state;
			if (current_state === constants.CLOSE_TOURNEY){
				exports.deleteTournament(guild_id).then( (status) =>{
					fulfill(status);
				}).catch( (err) => {
					Console.log(err);
					reject(err);
				});
			} else {
				if (current_state === constants.RUN_TOURNEY){
					guild_obj.tourney_sub_state = null; // reset run tourney state
				}
				current_state++;
				guild_obj.tourney_state = current_state;
				guild_obj.save().then( () => {
					fulfill(constants.UPDATE_SUCCESS);
				}).catch( (err) =>{
					Console.log(err);
					reject(err);
				});
			}
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* advanceTourneyRunState(guild_id)
 * -------------------------------------------------------
 * Attempts to find guild with given guild_id,
 * if any errors occur during tourney retrieval
 * or update the promise is rejected.
 * If the guild is not found, fulfills with NO_TOURNEY.
 * If a guild is found, check to ensure it is in RUN_TOURNEY,
 * if it is, check which sub state its in. If it is in the last substate
 * (STATE_ADV_DISPUTE), wrap around back to STATE_MATCH, otherwise
 * simply advance by one. If advance successfull, fulfill with
 * UPDATE_SUCCESS.
 * 
 * If tourney was not in RUN_TOURNEY, fulfills with null.

 * Returns- Promise, On successful fulfill UPDATE_SUCCESS
 * Usage:
 * db.advanceTourneyRunState(guild_id).then( (status) => {
 * 		//DO STUFF!
 * }).catch( (err) => {
 * 		/error handling
 * });
 * -------------------------------------------------------
*/
exports.advanceTourneyRunState = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY);}
			var current_state = guild_obj.tourney_state;
			if (current_state === constants.RUN_TOURNEY){
				var cur_run_state = guild_obj.tourney_sub_state;
				if (cur_run_state === constants.STATE_ADV_DISPUTE){
					guild_obj.tourney_sub_state = constants.STATE_MATCH;
				} else {
					guild_obj.tourney_sub_state = cur_run_state + 1;
				}
				guild_obj.save().then( () => {
					fulfill(constants.UPDATE_SUCCESS);
				}).catch( (err) =>{
					Console.log(err);
					reject(err);
				});
			} else {
				fulfill(null);
			}
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getTournamentTeams(guild_id)
 * -------------------------------------------------------
 * Attempts to find a guild by guild_id, if the guild is found
 * then retrieve the array of teamss and return upon
 * fulfillment. Any no tourney is found, fulfills with NO_TOURNEY.
 * If any errors occur, the promise is rejected.
 * Note: If no teams, an empty array is returned.
 * 
 * Returns- Promise, On successful fulfill Team Array
 * Usage:
 * db.getTournamentParticipants(guild_id).then( (teams) =>{
 * 	///do stuff
 * }).catch( (err) => {
 * 	/error handling
 * });
 * -------------------------------------------------------
*/
exports.getTournamentTeams = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY);}
			var teams = guild_obj.teams;
			fulfill(teams);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getTournamentParticipants(guild_id)
 * -------------------------------------------------------
 * Attempts to find a guild by guild_id, if the guild is found
 * then iterates over teams and retrieves array of participants
 *  and return upon fulfillment. Any no tourney is found, 
 * fulfills with NO_TOURNEY.
 * If any errors occur, the promise is rejected.
 * Note: If no participants, an empty array is returned.
 * 
 * Returns- Promise, On successful fulfill Participant Array
 * Usage:
 * db.getTournamentParticipants(guild_id).then( (participants) =>{
 * 	///do stuff
 * }).catch( (err) => {
 * 	/error handling
 * });
 * -------------------------------------------------------
*/
exports.getTournamentParticipants = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY);}
			var teams = guild_obj.teams;
			var participants = [];
			for (let team of teams){
				participants.concat(team.participants);	
			}
			fulfill(participants);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getTournamentChannels(guild_id)
 * -------------------------------------------------------
 * Attempts to find a guild by guild_id, if the guild is found
 * then retrieve the array of channels and return upon
 * fulfillment. If no tourney is found, fulffils with NO_TOURNEY.
 * If any errors occur during guild lookup, promise is rejected 
 * with error.
 * NOTE: If channels is empty, an empty array will be passed on 
 * fulfill.
 * 
 * Returns- Promise, On successful fulfill Channels Array
 * Usage:
 * db.getTournamentParticipants(guild_id).then( (channels) =>{
 * 	///do stuff
 * }).catch( (err) =>{
 * 	/error handling
 * });
 * -------------------------------------------------------
*/
exports.getTournamentChannels = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY);}
			var channels = guild_obj.channels;
			fulfill(channels);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* createTeam(guild_id, name, discord_id)
 * -------------------------------------------------------
 * Creates a new team by looking up the given guild,
 * creating a new team object and pushing it to
 * the guild's teams array.
 * If no guild is found, fulfills with NO_TOURNEY.
 * If no name or role id is provided, the promise will reject.
 * If a team already exists with the given role_id, promise rejects.
 * If any errors occur, promise will reject.
 * 
 * If team creation is successful, returns the team's ID.
 * 
 * Returns- Promise, On successful fulfill CREATE_SUCCESS
 * Usage:
 * db.createParticipant(guild_id, name, discord_id).then( (status)=> {
 * 	//do stuff
 * }).catch( (err) => {
 * 	//error handling
 * })
 * -------------------------------------------------------
*/
exports.createTeam = (guild_id, role_id, name) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY); }
			if (!role_id || 0 === role_id.length){
				Console.log('Must Provide a role id for team.');
				reject('Must provide a role id for team');
			}
			if (!name || 0 === name.length){
				Console.log('Must Provide a name for team.');
				reject('Must provide a name for team');
			}
			var team_obj = guild_obj.teams.find( (team) => {
				return team.role_id === role_id;
			});
			if (team_obj) { 
				Console.log('Team with given role_id already exists.');
				reject('Team with given role_id already exists.'); 
			}
			var new_team = {name:name, role_id:role_id, members:[]};
			guild_obj.teams.push(new_team);
			guild_obj.save().then( () => {
				fulfill(new_team._id);
			}).catch( (err) => {
				Console.log(err);
				reject(err);
			});
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* removeTeam(guild_id, role_id)
 * -------------------------------------------------------
 * Attempts to retrieve guild with given id, and then 
 * attempts to find team with given role id.
 * if found, team is removed and fulfill
 * with REMOVE_SUCCESS.
 * If Tourney not found, fulfill with NO_TOURNEY.
 * If team not found, fulfill with NO_TEAM.
 * If any eror occurs with either guild lookup or participant
 * removal, promise rejects with error.
 * 
 * Returns- Promise, On successful fulfill REMOVE_SUCCESS
 * Usage:
 * db.removeParticipant(guild_id, team_id, discord_id).then( (status)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.removeTeam = (guild_id, role_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			var findTeam = (team) =>{
				return team.role_id === role_id;
			};
			if (!guild_obj) { fulfill(constants.NO_TOURNEY); }
			var teamIndex = guild_obj.team.findIndex(findTeam);
			if (teamIndex === -1) {fulfill(constants.NO_TEAM);}
			guild_obj.members.splice(teamIndex,1);
			guild_obj.save( () => {
				fulfill(constants.REMOVE_SUCCESS);
			}).catch( (err) => {
				Console.log(err);
				reject(err);
			});
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getTeamID(guild_id, role_id)
 * -------------------------------------------------------
 * Attempts to retrieve guild with given id, and then 
 * attempts to find team with given role id.
 * If found, fulfills with the team id.
 * If Tourney not found, fulfill with NO_TOURNEY.
 * If team not found, fulfill with NO_TEAM.
 * If any eror occurs with either guild or team lookup 
 * promise rejects with error.
 * 
 * Returns- Promise, On successful fulfill Team_id
 * Usage:
 * db.getTeamID(guild_id, role_id).then( (team_id)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getTeamID = (guild_id, role_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			var findTeam = (team) =>{
				return team.role_id === role_id;
			};
			if (!guild_obj) { fulfill(constants.NO_TOURNEY); }
			var team_obj = guild_obj.team.find(findTeam);
			if (!team_obj) {fulfill(constants.NO_TEAM);}
			fulfill(team_obj._id);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* createParticipant(guild_id, name, discord_id)
 * -------------------------------------------------------
 * Creates a new participant by looking up the given guild,
 * creating a new participant object and pushing it to
 * the guild's participants array.
 * If no name or discord id is provided, the promise will reject.
 * If any errors occur, promise will reject.
 * If no guild is found, fulfills with NO_TOURENEY.
 * 
 * Returns- Promise, On successful fulfill CREATE_SUCCESS
 * Usage:
 * db.createParticipant(guild_id, name, discord_id).then( (status)=> {
 * 	//do stuff
 * }).catch( (err) => {
 * 	//error handling
 * })
 * -------------------------------------------------------
*/
exports.createParticipant = (guild_id, name, discord_id, team_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY); }
			if (!name || 0 === name.length){
				Console.log('Must Provide a name for participant.');
				reject('Must provide a name for participant');
			}
			if (!discord_id || 0 === discord_id.length){
				Console.log('Must Provide a discord id for participant.');
				reject('Must provide a discord id for participant');
			}
			var team_obj = guild_obj.teams.find( (team) => {
				return team.id === team_id;
			});
			if (!team_obj) { fulfill(constants.NO_TEAM); }
			var new_participant = {name:name, ids:{discord_id:discord_id, role_id:team_obj.role_id}};
			team_obj.members.push(new_participant);
			guild_obj.save().then( () => {
				fulfill(constants.CREATE_SUCCESS);
			}).catch( (err) => {
				Console.log(err);
				reject(err);
			});
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* removeParticipant(guild_id, discord_id)
 * -------------------------------------------------------
 * Attempts to retrieve guild with given id, and then 
 * attempts to find team with given id, then
 * find participant with given discord_id,
 * if found, participant is removed and fulfill
 * with REMOVE_SUCCESS.
 * If Tourney not found, fulfill with NO_TOURNEY.
 * If team not found, fulfill with NO_TEAM.
 * If participant not found, fulfill with NO_PARTICIPANT.
 * If any eror occurs with either guild lookup or participant
 * removal, promise rejects with error.
 * 
 * Returns- Promise, On successful fulfill REMOVE_SUCCESS
 * Usage:
 * db.removeParticipant(guild_id, team_id, discord_id).then( (status)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.removeParticipant = (guild_id, team_id, discord_id) => {
	return new Promise((fulfill, reject) => {
		var findParticipant = (participant) =>{
			return participant.ids.discord_id === discord_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY); }
			var team_obj = guild_obj.teams.find( (team) => {
				return team.id === team_id;
			});
			if (!team_obj) { fulfill(constants.NO_TEAM); }
			var participantIndex = team_obj.members.findIndex(findParticipant);
			if (participantIndex === -1) {fulfill(constants.NO_PARTICIPANT);}
			team_obj.members.splice(participantIndex,1);
			guild_obj.save( () => {
				fulfill(constants.REMOVE_SUCCESS);
			}).catch( (err) => {
				Console.log(err);
				reject(err);
			});
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* setParticipantChallongeID(guild_id, discord_id)
 * -------------------------------------------------------
 * Attempts to retrieve guild with given id, look up participant
 * and update the challonge id.
 * 
 * If guild not found fulfill with NO TOURNEY
 * If participant not found fulfill with NO_PARTICIPANT
 * If errors occur during lookup or update, Reject with error
 * 
 * Returns: Promise -- On Success fulfills with UPDATE_SUCCESS
 * Usage:
 * db.setParticipantChallongeID(guild_id, discord_id, challonge_id).then( (status)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.setParticipantChallongeID = (guild_id, discord_id, challonge_id) => {
	return new Promise((fulfill, reject) => {
		var findParticipant = (participant) =>{
			return participant.ids.discord_id === discord_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY); }
			var participant = guild_obj.participants.find(findParticipant);
			if (!participant){ fulfill(constants.NO_PARTICIPANT);}
			participant.ids.challonge_id = challonge_id;
			guild_obj.save( () => {
				fulfill(constants.UPDATE_SUCCESS);
			}).catch( (err) => {
				Console.log(err);
				reject(err);
			});
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};
/* setParticipantRoleID(guild_id, discord_id, role_id)
 * -------------------------------------------------------
 * Attempts to retrieve guild with given id, look up participant
 * and update the role id.
 * 
 * If guild not found fulfill with NO TOURNEY
 * If participant not found fulfill with NO_PARTICIPANT
 * If errors occur during lookup or update, Reject with error
 * 
 * Returns: Promise -- On Success fulfills with UPDATE_SUCCESS
 * Usage:
 * db.setParticipantRoleID(guild_id, discord_id, role_id).then( (status)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.setParticipantRoleID = (guild_id, discord_id, role_id) => {
	return new Promise((fulfill, reject) => {
		var findParticipant = (participant) =>{
			return participant.ids.discord_id === discord_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY); }
			var participant = guild_obj.participants.find(findParticipant);
			if (!participant){ fulfill(constants.NO_PARTICIPANT);}
			participant.ids.role_id = role_id;
			guild_obj.save( () => {
				fulfill(constants.UPDATE_SUCCESS);
			}).catch( (err) => {
				Console.log(err);
				reject(err);
			});
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};
/* getParticipantChallongeID(guild_id, discord_id)
 * -------------------------------------------------------
 *  Attempts to retrieve guild with given id, look up participant
 * and return the challonge id.
 * 
 * If guild not found fulfill with NO TOURNEY
 * If participant not found fulfill with NO_PARTICIPANT
 * If participant has no id, fulfill with NULL
 * If errors occur during lookup or update, Reject with error
 * 
 * Returns: Promise -- On Success fulfills with Challonge_ID
 * Usage:
 * db.getParticipantChallongeID(guild_id, discord_id).then( (challonge_id)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getParticipantChallongeID = (guild_id, discord_id) => {
	return new Promise((fulfill, reject) => {
		var findParticipant = (participant) =>{
			return participant.ids.discord_id === discord_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY); }
			var participant = guild_obj.participants.find(findParticipant);
			if (!participant){ fulfill(constants.NO_PARTICIPANT);}
			if (!participant.ids.challonge_id){fulfill(null);}
			fulfill(participant.ids.challonge_id);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getParticipantDiscordID(guild_id, challonge_id)
 * -------------------------------------------------------
 * Attempts to retrieve guild with given id, look up participant
 * and return the discord id.
 * 
 * If guild not found fulfill with NO TOURNEY
 * If participant not found fulfill with NO_PARTICIPANT
 * If errors occur during lookup or update, Reject with error
 * 
 * Returns: Promise -- On Success fulfills with Discord_ID
 * Usage:
 * db.getParticipantDiscordID(guild_id, challonge_id).then( (challonge_id)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getParticipantDiscordID = (guild_id, challonge_id) => {
	return new Promise((fulfill, reject) => {
		var findParticipant = (participant) =>{
			return participant.ids.challonge_id === challonge_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj){ fulfill(constants.NO_TOURNEY);}
			var participant = guild_obj.participants.find(findParticipant);
			if (!participant){fulfill(constants.NO_PARTICIPANT);}
			fulfill(participant.ids.discord_id);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getParticipantRoleID(guild_id, discord_id)
 * -------------------------------------------------------
 *  Attempts to retrieve guild with given id, look up participant
 * and return the role id.
 * 
 * If guild not found fulfill with NO TOURNEY
 * If participant not found fulfill with NO_PARTICIPANT
 * If participant has no id, fulfill with NULL
 * If errors occur during lookup or update, Reject with error
 * 
 * Returns: Promise -- On Success fulfills with Role_ID
 * Usage:
 * db.getParticipantRoleID(guild_id, discord_id).then( (role_id)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getParticipantRoleID = (guild_id, discord_id) => {
	return new Promise((fulfill, reject) => {
		var findParticipant = (participant) =>{
			return participant.ids.discord_id === discord_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj){ fulfill(constants.NO_TOURNEY); }
			var participant = guild_obj.participants.find(findParticipant);
			if (!participant){ fulfill(constants.NO_PARTICIPANT); }
			if (!participant.ids.role_id){ fulfill(null); }
			fulfill(participant.ids.role_id);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getParticipantsByRoleID(guild_id, role_id)
 * -------------------------------------------------------
 *  Attempts to retrieve guild with given id, look up participants
 * with the given role_id and return an array of matching
 * participants.
 * 
 * If guild not found fulfill with NO TOURNEY
 * If participants not found fulfill with NO_PARTICIPANT
 * If errors occur during lookup or update, Reject with error
 * 
 * Returns: Promise -- On Success fulfills with Array of participants
 * Usage:
 * db.getParticipantsByRoleID(guild_id, role_id).then( (participants)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getParticipantsByRoleID = (guild_id, role_id) => {
	return new Promise((fulfill, reject) => {
		var findParticipant = (participant) =>{
			return participant.ids.role_id === role_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj){ fulfill(constants.NO_TOURNEY); }
			var participants = guild_obj.participants.filter(findParticipant);
			if (participants.length === 0) {fulfill(constants.NO_PARTICIPANT); }
			fulfill(participants);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* createChannel(guild_id, channel_id, channel_type)
 * -------------------------------------------------------
 * Creates a new channel by looking up the given guild,
 * and storing the channel_id, channel_type, and ref_id.
 *
 * Channel types can be found under util/constants.js
 *
 * If channel is a match channel, ref_id refers to match id,
 * If channel is jury channel, ref_id refers specific id.
 *
 * Returns: Promise -- On Success Fulfill with CREATE_SUCCESS.
 * Usage:
 * db.createChannel(guild_id, name, discord_id).then( (status) => {
 * 	//do stuff
 * }).catch( (err) => {
 * 	//error handling
 * })
 * -------------------------------------------------------
*/
exports.createChannel = (guild_id, channel_id, channel_type, ref_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY); }
			if (!channel_type){
				Console.log('Must Provide a channel type.');
				reject('Must Provide a channel type.');
			}
			if (!channel_id || 0 === channel_id.length){
				Console.log('Must Provide a channel id.');
				reject('Must Provide a channel id.');
			}
			var new_channel = {channel_type: channel_type, channel_id:channel_id, ref_id:ref_id};
			guild_obj.channels.push(new_channel);
			guild_obj.save().then( () => {
				fulfill(constants.CREATE_SUCCESS);
			}).catch( (err) => {
				Console.log(err);
				reject(err);
			});
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getChannelType(guild_id, channel_id)
 * -------------------------------------------------------
 * Attempts to look up guild with given id, then looks up
 * given channel and fulfills with channel type.
 * 
 * If no tourney found, fulfills with NO_TOURNEY.
 * If no channel found, fulfills with NO_CHANNEL.
 * If any errors occur during lookup, rejects with error.
 * 
 * Returns: Promise -- On success fulfills with channel_type
 * Usage:
 * db.getChannelType(guild_id, channel_id).then( (channel_type) => {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getChannelType = (guild_id, channel_id) => {
	return new Promise((fulfill, reject) => {
		var findChannel = (channel) =>{
			return channel.channel_id === channel_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY); }
			var channel = guild_obj.channels.find(findChannel);
			if (!channel){ fulfill(constants.NO_CHANNEL); }
			fulfill(channel.channel_type);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* deleteChannel(guild_id, channel_id)
 * -------------------------------------------------------
 * Attempts to look up guild with given id, then looks up
 * given channel and removes it.
 * 
 * If no tourney found, fulfills with NO_TOURNEY.
 * If no channel found, fulfills with NO_CHANNEL.
 * If any errors occur during lookup or removal, rejects with error.
 * 
 * Returns: Promise -- On success fulfills with REMOVE_SUCCESS
 * Usage:
 * db.deleteChannel(guild_id, channel_id).then( (status) => {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.deleteChannel = (guild_id, channel_id) => {
	return new Promise((fulfill, reject) => {
		var findChannel = (channel) =>{
			return channel.channel_id === channel_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY); }
			var channelIndex = guild_obj.channels.findIndex(findChannel);
			if (channelIndex === -1) {fulfill(constants.NO_CHANNEL);}
			guild_obj.channels.splice(channelIndex,1);
			guild_obj.save( () => {
				fulfill(constants.REMOVE_SUCCESS);
			}).catch( (err) => {
				Console.log(err);
				reject(err);
			});
		}).catch( (err) =>{
			Console.log(err);
			reject(err);
		});
	});
};

/* deleteChannesByTypel(guild_id, channel_type)
 * -------------------------------------------------------
 * Attempts to look up guild with given id, then looks up
 * channels with given type and removes all of them..
 * 
 * If no tourney found, fulfills with NO_TOURNEY.
 * If no channels found, fulfills with NO_CHANNEL.
 * If any errors occur during lookup or removal, rejects with error.
 * 
 * Returns: Promise -- On success fulfills with REMOVE_SUCCESS
 * Usage:
 * db.deleteChannelsByType(guild_id, channel_type).then( (status) => {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.deleteChannelsByType = (guild_id, channel_type) => {
	return new Promise((fulfill, reject) => {
		var findChannel = (channel) =>{
			return channel.channel_type === channel_type;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (!guild_obj) { fulfill(constants.NO_TOURNEY); }
			if (!guild_obj.channels.some(findChannel)) {fulfill(constants.NO_CHANNEL);}
			var channels = guild_obj.channels;
			//The arrow functoin below creates a new array
			//by filtering out those that have the old channel type.
			//the channels array is then updated to reflect the removal.
			channels = channels.reduce((p,c) => (c.channel_type !== channel_type && p.push(c),p),[]);
			guild_obj.channels = channels;
			guild_obj.save( () => {
				fulfill(constants.REMOVE_SUCCESS);
			}).catch( (err) => {
				Console.log(err);
				reject(err);
			});
		}).catch( (err) =>{
			Console.log(err);
			reject(err);
		});
	});	
};
// TODO: createChatState(???)
// actually maybe isn't necessary but am not sure
/* deleteTournament(guild_id)
 * -------------------------------------------------------
 *
 * -------------------------------------------------------
*/
// TODO: getChatState(???)
// returns a chat state object.
// Users: be sure to obj.save()!!
/* deleteTournament(guild_id)
 * -------------------------------------------------------
 *
 * -------------------------------------------------------
*/


module.exports = exports;
