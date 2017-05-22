/* AVAILABLE FUNCTIONS:
 * --------------------------------------------------------
 * clearDB()
 * TOURNAMENTS:
 * createTournament(guild_id) *
 * deleteTournament(guild_id) *
 * setTournamentChallongeID(guild_id, challonge_id) *
 * getTournamentChallongeID(guild_id) *
 * getTournamentStatus(guild_id) *
 * getTournamentRunState(guild_id) *
 * advanceTournamentState(guild_id) *
 * advanceTournamentRunState(guild_id) *
 * getTournamentTeams(guild_id) *
 * getTournamentParticipants(guild_id) *
 * getTournamentChannels(guild_id) *
 * getTournamentDisputes(guild_id)
 * getTournamentDisputesByOriginator(guild_id, discord_id)
 * getTournamentDisputesByType(guild_id, dispute_type)
 * TEAMS:
 * createTeam(guild_id, role_id, name) *
 * removeTeam(guild_id, role_id) *
 * getTeamIDByRoleID(guild_id, role_id) *
 * getTeamIDByName(guild_id, name) *
 * getTeamCreatorByTeamID(guild_id, team_id) *
 * getTeamCreatorByRoleID(guild_id, role_id) *
 * setTeamChallongeID(guild_id, team_id, challonge_id) *
 * getTeamChallongeID(guild_id, team_id) *
 * setTeamRoleID(guild_id, team_id, role_id) *
 * getTeamRoleID(guild_id, team_id) *
 * getTeamMembersByID(guild_id, team_id)
 * getTeamMembersByRoleID(guild_id, role_id)
 * PARTICIPANTS:
 * createParticipant(guild_id, name, discord_id, team_id) *
 * removeParticipant(guild_id, discord_id) *
 * getParticipantDiscordID(guild_id, name) *
 * getParticipantTeamID(guild_id, name) *
 * DISPUTES:
 * createDispute(guild_id, originator_id, defendant_id, dispute_type, add_info) *
 * resolveDispute(guild_id, dispute_id) *
 * resolveDisputesByType(guild_id, dispute_type) *
 * getDisputeID(guild_id, defendant_id) *
 * getDisputeByID(guild_id, dispute_id) *
 * CHANNELS:
 * createChannel(guild_id, channel_id, channel_type) *
 * getChannelType(guild_id, channel_id) *
 * deleteChannel(guild_id, channel_id) *
 * deleteChannesByTypel(guild_id, channel_type) *
 */
var mongoose = require('mongoose');
var constants = require('../util/constants');
const Console = require('../util/console');
const SCHEMAS = require('./schemas/guildSchema.js');
var Guild = SCHEMAS.Guild;
var Team = SCHEMAS.Team;
// var Dispute = SCHEMAS.Dispute;
// eslint-disable-next-line
var challongeclient = require('./challonge');

var exports = {};


//initialize database, and report access
mongoose.connect(constants.DATABASE_ADDRESS);
mongoose.Promise = global.Promise;

var db = mongoose.connection;

mongoose.set('debug', constants.MONGO_DEBUG);

db.on('error', (err) =>{
	Console.error.bind(Console, 'connection error:');
	Console.log(err);
	Console.log('\n\nYou must be running MongoDB. If you are, check the error above for more information.');
});
db.once('open', () => {
	Console.log('Connected to MongoDB.');
});

exports.clearDB = () =>{
	return new Promise((fulfill, reject) => {
		Guild.remove({}, (err)=>{
			if (err) { reject(err);	}
			Team.remove({}, (err) =>{
				if(err) {reject(err);}
				fulfill(constants.REMOVE_SUCCESS);
			});
		});
	});
};

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
			if (guild_obj === null){
				Guild.create({
					guild_id: guild_id,
					tourney_state: constants.INIT_TOURNEY,
					tourney_sub_state: constants.STATE_DISPUTE
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
				return;
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
			if (guild_obj === null){ fulfill(constants.NO_TOURNEY); return;}
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

/* setTournamentChallongeID(guild_id, challonge_id)
 * -------------------------------------------------------
 * Attempts to find the guild with the given id, if
 * guild not found, fulfills with NO_TOURNEY. Else
 * the challonge id is set and and the guild is updated.
 * If the update is succesful, the promise fulfills with
 * UDPATE_SUCCESS, else rejected with error message.
 * Returns: Promise -- On successful fulfill UPDATE_SUCCESS
 *
 * Usage:
 * db.setTournamentChallongeID(guild_id, challonge_id).then( (status)=>{
 * 		//DO STUFF
 * }).catch((err)=>{
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.setTournamentChallongeID = (guild_id, challonge_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id: guild_id,
		}).then( (guild_obj) => {
			if (guild_obj === null){ fulfill(constants.NO_TOURNEY);return; }
			guild_obj.challonge_id = challonge_id;
			guild_obj.save().then( () =>{
				Console.log('ChallongeID set to:' + challonge_id +' for guild with id:' + guild_id);
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

/* getTournamentChallongeID(guild_id)
 * -------------------------------------------------------
 * Attempts to find the guild with the given id,
 * and if that guild's challonge id is not null, the promise
 * is fulfilled and the challonge id is returned.
 * If tourney not found, fulfill with NO_TOURNEY.
 * NOTE:If ChallongeID is null, fulfill will be null.
 * If any error occurs, the promise will be rejected.
 * Returns: Promise -- On successful fulfill returns challonge ID.
 * Usage:
 * db.getTournamentChallongeID(guild_id).then( (challonge_id) =>{
 * 		//DO STUFF
 * }).catch( (err) =>{
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getTournamentChallongeID = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id: guild_id,
		}).then( (guild_obj) => {
			if (guild_obj === null){ fulfill(constants.NO_TOURNEY);return; }
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
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			var tourney_state = guild_obj.tourney_state;
			fulfill(tourney_state);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getTournamentRunState(guild_id)
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
 * db.getTournamentRunState(guild_id).then( (tourney_state){
 * 		//DO STUFF
 * }).catch((err)=>{
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getTournamentRunState = (guild_id) => {
	return new Promise( (fulfill, reject) => {
		Guild.findOne({
			guild_id: guild_id
		}).then( (guild_obj) => {
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
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
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return;}
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
					guild_obj.tourney_sub_state = -1; // reset run tourney state
				}
				current_state++;
				if (current_state === constants.RUN_TOURNEY){
					guild_obj.tourney_sub_state = constants.STATE_MATCH; // reset run tourney state
				}
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

/* advanceTournamentRunState(guild_id)
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
 * db.advanceTournamentRunState(guild_id).then( (status) => {
 * 		//DO STUFF!
 * }).catch( (err) => {
 * 		/error handling
 * });
 * -------------------------------------------------------
*/
exports.advanceTournamentRunState = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return;}
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
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return;}
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
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return;}
			var teams = guild_obj.teams;
			var participants = [];
			for (var team in teams){
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
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return;}
			var channels = guild_obj.channels;
			fulfill(channels);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getTournamentDisputes(guild_id)
 * -------------------------------------------------------
 * Attempts to find a guild by guild_id, if the guild is found
 * then retrieve the array of disputes and return upon
 * fulfillment. If no tourney is found, fulffils with NO_TOURNEY.
 * If any errors occur during guild lookup, promise is rejected
 * with error.
 * NOTE: If no disputes, an empty array will be passed on
 * fulfill.
 *
 * Returns- Promise, On successful fulfill Disputes Array
 * Usage:
 * db.getTournamentDisputes(guild_id).then( (disputes) =>{
 * 	///do stuff
 * }).catch( (err) =>{
 * 	/error handling
 * });
 * -------------------------------------------------------
*/
exports.getTournamentDisputes = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return;}
			var disputes = guild_obj.disputes;
			fulfill(disputes);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getTournamentDisputesByOriginator(guild_id, discord_id)
 * -------------------------------------------------------
 * Attempts to find a guild by guild_id, if the guild is found
 * then retrieve the array of disputes with the given
 * originator and return upon an array of them upon
 * fulfillment. If no tourney is found, fulffils with NO_TOURNEY.
 * If any errors occur during guild lookup, promise is rejected
 * with error.
 * NOTE: If no disputes, an empty array will be passed on
 * fulfill.
 *
 * Returns- Promise, On successful fulfill Disputes Array
 * Usage:
 * db.getTournamentDisputesByOriginator(guild_id, discord_id).then( (disputes) =>{
 * 	///do stuff
 * }).catch( (err) =>{
 * 	/error handling
 * });
 * -------------------------------------------------------
*/
exports.getTournamentDisputesByOriginator = (guild_id, discord_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return;}
			var disputes = guild_obj.disputes;
			disputes = disputes.reduce((p,c) => (c.originator === discord_id && p.push(c),p),[]);
			fulfill(disputes);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};
/* getTournamentDisputesByType(guild_id)
 * -------------------------------------------------------
 * Attempts to find a guild by guild_id, if the guild is found
 * then retrieve the array of disputes and return upon
 * fulfillment. If no tourney is found, fulffils with NO_TOURNEY.
 * If any errors occur during guild lookup, promise is rejected
 * with error.
 * NOTE: If no disputes, an empty array will be passed on
 * fulfill.
 *
 * Returns- Promise, On successful fulfill Disputes Array
 * Usage:
 * db.getTournamentDisputes(guild_id).then( (disputes) =>{
 * 	///do stuff
 * }).catch( (err) =>{
 * 	/error handling
 * });
 * -------------------------------------------------------
*/
exports.getTournamentDisputesByType = (guild_id, dispute_type) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return;}
			var disputes = guild_obj.disputes;
			disputes = disputes.reduce((p,c) => (c.type === dispute_type && p.push(c),p),[]);
			fulfill(disputes);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* createTeam(guild_id, role_id, name)
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
 * db.createTeam(guild_id, role_id, name).then( (status)=> {
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
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			if (role_id === null || 0 === role_id.length){
				Console.log('Must Provide a role id for team.');
				reject('Must provide a role id for team');
			}
			if (name  === null || 0 === name.length){
				Console.log('Must Provide a name for team.');
				reject('Must provide a name for team');
			}
			var team_obj = guild_obj.teams.find( (team) => {
				return (team.role_id === role_id || team.name === name);
			});
			if (team_obj) {
				fulfill(constants.TEAM_EXISTS);
				return;
			}
			var new_team = new Team();
			new_team.name = name;
			new_team.role_id = role_id;
			Team.create(new_team).then( (saved_team) => {
				guild_obj.teams.push(saved_team);
				guild_obj.save().then( () => {
					fulfill(saved_team._id);
				}).catch( (err) => {
					Console.log(err);
					reject(err);
				});
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
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			var teamIndex = guild_obj.teams.findIndex(findTeam);
			if (teamIndex === -1) {fulfill(constants.NO_TEAM);return;}
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

/* getTeamIDByRoleID(guild_id, role_id)
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
exports.getTeamIDByRoleID = (guild_id, role_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			var findTeam = (team) =>{
				return team.role_id === role_id;
			};
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			var team_obj = guild_obj.teams.find(findTeam);
			if (!team_obj) {fulfill(constants.NO_TEAM);return;}
			fulfill(team_obj._id);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getTeamIDByName(guild_id, name)
 * -------------------------------------------------------
 * Attempts to retrieve guild with given id, and then
 * attempts to find team with given name.
 * If found, fulfills with the team id.
 * If Tourney not found, fulfill with NO_TOURNEY.
 * If team not found, fulfill with NO_TEAM.
 * If any eror occurs with either guild or team lookup
 * promise rejects with error.
 *
 * Returns- Promise, On successful fulfill Team_id
 * Usage:
 * db.getTeamID(guild_id, name).then( (team_id)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getTeamIDByName = (guild_id, name) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			var findTeam = (team) =>{
				return team.name === name;
			};
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			var team_obj = guild_obj.teams.find(findTeam);
			if (!team_obj) {fulfill(constants.NO_TEAM);return;}
			Console.log(team_obj);
			fulfill(team_obj._id);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getTeamCreatorByTeamID(guild_id, team_id)
 * -------------------------------------------------------
 * Attempts to retrieve guild with given id, and then
 * attempts to find team with given team_id. If team is found,
 * return discord_id of team creator.
 * If found, fulfills with the team id.
 * If Tourney not found, fulfill with NO_TOURNEY.
 * If team not found, fulfill with NO_TEAM.
 * If team has no creator, returns null.
 * If any eror occurs with either guild or team lookup
 * promise rejects with error.
 *
 * Returns- Promise, On successful fulfill team creator discord_id
 * Usage:
 * db.getTeamID(guild_id, team_id).then( (creator_id)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getTeamCreatorByTeamID = (guild_id, team_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			var findTeam = (team) =>{
				return team._id === team_id;
			};
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			var team_obj = guild_obj.teams.find(findTeam);
			if (team_obj === null) {fulfill(constants.NO_TEAM);return;}
			if (team_obj.creator === null || team_obj.creator.length === 0){
				fulfill(null);
			}
			fulfill(team_obj.creator);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getTeamCreatorByRoleID(guild_id, role_id)
 * -------------------------------------------------------
 * Attempts to retrieve guild with given id, and then
 * attempts to find team with given role_id. If team is found,
 * return discord_id of team creator.
 * If found, fulfills with the team id.
 * If Tourney not found, fulfill with NO_TOURNEY.
 * If team not found, fulfill with NO_TEAM.
 * If team has no creator, returns null.
 * If any eror occurs with either guild or team lookup
 * promise rejects with error.
 *
 * Returns- Promise, On successful fulfill team creator discord_id
 * Usage:
 * db.getTeamID(guild_id, role_id).then( (creator_id)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getTeamCreatorByRoleID = (guild_id, role_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			var findTeam = (team) =>{
				return team.role_id === role_id;
			};
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			var team_obj = guild_obj.teams.find(findTeam);
			if (team_obj === null) {fulfill(constants.NO_TEAM);return;}
			if (team_obj.creator === null || team_obj.creator.length === 0){
				fulfill(null);
			}
			fulfill(team_obj.creator);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* setTeamChallongeID(guild_id, team_id, challonge_id)
 * -------------------------------------------------------
 * Attempts to retrieve guild with given id, look up team
 * and update the challonge id.
 *
 * If guild not found fulfill with NO TOURNEY
 * If team not found fulfill with NO_TEAM
 * If errors occur during lookup or update, Reject with error
 *
 * Returns: Promise -- On Success fulfills with UPDATE_SUCCESS
 * Usage:
 * db.setTeamChallongeID(guild_id, team_id, challonge_id).then( (status)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.setTeamChallongeID = (guild_id, team_id, challonge_id) => {
	return new Promise((fulfill, reject) => {
		// var findTeam = (team) =>{
		// 	return team._id === team_id;
		// };
		Team.findById(team_id).then( (team_obj) => {
			if (team_obj === null){ fulfill(constants.NO_TEAM);return;}
			team_obj.challonge_id = challonge_id;
			team_obj.save( () => {
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

/* setTeamRoleID(guild_id, team_id, role_id)
 * -------------------------------------------------------
 * Attempts to retrieve guild with given id, look up team
 * and update the role id.
 *
 * If guild not found fulfill with NO TOURNEY
 * If team not found fulfill with NO_TEAM
 * If errors occur during lookup or update, Reject with error
 *
 * Returns: Promise -- On Success fulfills with UPDATE_SUCCESS
 * Usage:
 * db.setTeamRoleID(guild_id, team_id, role_id).then( (status)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.setTeamRoleID = (guild_id, team_id, role_id) => {
	return new Promise((fulfill, reject) => {
		Team.findById(team_id).then( (team_obj) => {
			if (team_obj === null){ fulfill(constants.NO_TEAM);return;}
			team_obj.role_id = role_id;
			team_obj.save( () => {
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

/* getTeamChallongeID(guild_id, team_id)
 * -------------------------------------------------------
 *  Attempts to retrieve guild with given id, look up team
 * and return the challonge id.
 *
 * If guild not found fulfill with NO TOURNEY
 * If team not found fulfill with NO_TEAM
 * If team has no id, fulfill with NULL
 * If errors occur during lookup or update, Reject with error
 *
 * Returns: Promise -- On Success fulfills with Challonge_ID
 * Usage:
 * db.getTeamChallongeID(guild_id, team_id).then( (challonge_id)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getTeamChallongeID = (guild_id, team_id) => {
	return new Promise((fulfill, reject) => {
		Team.findById(team_id).then( (team_obj) => {
			if (!team_obj){ fulfill(constants.NO_TEAM);return;}
			fulfill(team_obj.challonge_id);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getTeamRoleID(guild_id, team_id)
 * -------------------------------------------------------
 *  Attempts to retrieve guild with given id, look up team
 * and return the role id.
 *
 * If guild not found fulfill with NO TOURNEY
 * If team not found fulfill with NO_TEAM
 * If team has no id, fulfill with NULL
 * If errors occur during lookup or update, Reject with error
 *
 * Returns: Promise -- On Success fulfills with Role_ID
 * Usage:
 * db.getTeamRoleID(guild_id, team_id).then( (role_id)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getTeamRoleID = (guild_id, team_id) => {
	return new Promise((fulfill, reject) => {
		var findTeam = (team) =>{
			return team._id === team_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			var team_obj = guild_obj.teams.find(findTeam);
			if (team_obj === null){ fulfill(constants.NO_TEAM);return;}
			fulfill(team_obj.role_id);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};
/* getTeamMembersByID(guild_id, team_id)
 * -------------------------------------------------------
 *  Attempts to retrieve guild with given id, look up team
 * and return array of team members.
 *
 * If guild not found fulfill with NO TOURNEY
 * If team not found fulfill with NO_TEAM
 * If team has no members, fulfill with ewmpty array.
 * If errors occur during lookup or update, Reject with error
 *
 * Returns: Promise -- On Success fulfills with Array of Members
 * Usage:
 * db.getTeamMembers(guild_id, team_id).then( (members)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getTeamMembersByID = (guild_id, team_id) => {
	return new Promise((fulfill, reject) => {
		var findTeam = (team) =>{
			return team._id === team_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			var team_obj = guild_obj.teams.find(findTeam);
			if (team_obj === null){ fulfill(constants.NO_TEAM);return;}
			fulfill(team_obj.members);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getTeamMembersByRoleID(guild_id, role_id)
 * -------------------------------------------------------
 *  Attempts to retrieve guild with given id, look up team
 * and return array of team members.
 *
 * If guild not found fulfill with NO TOURNEY
 * If team not found fulfill with NO_TEAM
 * If team has no members, fulfill with ewmpty array.
 * If errors occur during lookup or update, Reject with error
 *
 * Returns: Promise -- On Success fulfills with Array of Members
 * Usage:
 * db.getTeamMembersByRoleID(guild_id, role_id).then( (members)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getTeamMembersByRoleID = (guild_id, role_id) => {
	return new Promise((fulfill, reject) => {
		var findTeam = (team) =>{
			return team.role_id === role_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			var team_obj = guild_obj.teams.find(findTeam);
			if (team_obj === null){ fulfill(constants.NO_TEAM);return;}
			fulfill(team_obj.members);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};
/* createParticipant(guild_id, name, discord_id, team_id)
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
 * db.createParticipant(guild_id, name, discord_id, team_id).then( (status)=> {
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
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
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
			if (team_obj === null) { fulfill(constants.NO_TEAM); return;}
			for (var team in guild_obj.teams){
				var participant = team.members.find( (member) => {
					return member.ids.discord_id === discord_id;
				});
				if (participant) {fulfill(constants.PARTICIPANT_IN_TEAM);}
			}
			var new_participant = {name:name, ids:{discord_id:discord_id, role_id:team_obj.role_id}};
			if (team_obj.members.length === 0){
				team_obj.owner = discord_id;
			}
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

/* removeParticipant(guild_id, team_id, discord_id)
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
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			var team_obj = guild_obj.teams.find( (team) => {
				return team.id === team_id;
			});
			if (team_obj === null) { fulfill(constants.NO_TEAM); return;}
			var participantIndex = team_obj.members.findIndex(findParticipant);
			if (participantIndex === -1) {fulfill(constants.NO_PARTICIPANT);return;}
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

/* getParticipantDiscordID(guild_id, name)
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
 * db.getParticipantDiscordID(guild_id, challonge_id).then( (discord_id)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getParticipantDiscordID = (guild_id, name) => {
	return new Promise((fulfill, reject) => {
		var findParticipant = (participant) =>{
			return participant.name === name;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (guild_obj === null){ fulfill(constants.NO_TOURNEY);return;}
			if (guild_obj.teams.length > 0){
				for (var team in guild_obj.teams){
					var participant = team.members.find(findParticipant);
					if (participant) {fulfill(participant.ids.discord_id);return;}
				}
			}
			fulfill(constants.NO_PARTICIPANT);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

/* getParticipantTeamID(guild_id, discord_id)
 * -------------------------------------------------------
 *  Attempts to retrieve guild with given id, look up participant
 * and return the team id.
 *
 * If guild not found fulfill with NO TOURNEY
 * If participant not found fulfill with NO_PARTICIPANT
 * If errors occur during lookup or update, Reject with error
 *
 * Returns: Promise -- On Success fulfills with Role_ID
 * Usage:
 * db.getParticipantTeamID(guild_id, discord_id).then( (team_id)=> {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getParticipantTeamID = (guild_id, discord_id) => {
	return new Promise((fulfill, reject) => {
		var findParticipant = (participant) =>{
			return participant.ids.discord_id === discord_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (guild_obj === null){ fulfill(constants.NO_TOURNEY);return;}
			if (guild_obj.teams.length > 0){
				for (var team in guild_obj.teams){
					var participant = team.members.find(findParticipant);
					if (participant) {fulfill(team._id);return;}
				}
			}
			fulfill(constants.NO_PARTICIPANT);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};


/* createDispute(guild_id, originator_id, defendant_id, dispute_type, add_info)
 * -------------------------------------------------------
 * Creates a new dispute by looking up the given guild,
 * and storing the defendant_id, originator_id,
 * dispute type and any additional info.
 * If guild is not found, fulfills with NO_TOURNEY
 * If a dispute is found, fulfills with DISPUTE_EXISTS.
 *
 * Dispute types can be found under util/constants.js
 *
 * Returns: Promise -- On Success Fulfill with CREATE_SUCCESS.
 * Usage:
 * db.createDIspute(guild_id, originator_id, defendant_id, dispute_type, add_info)).then( (status) => {
 * 	//do stuff
 * }).catch( (err) => {
 * 	//error handling
 * })
 * -------------------------------------------------------
*/
exports.createDispute = (guild_id, originator_id, defendant_id, dispute_type, add_info) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			if (!originator_id){
				Console.log('Must Provide an originator id.');
				reject('Must Provide an originator id.');
			}
			if (!defendant_id){
				Console.log('Must Provide an defendant id.');
				reject('Must Provide an defendant id.');
			}
			if (!dispute_type){
				Console.log('Must Provide a dispute type.');
				reject('Must Provide a dispute type.');
			}
			var findDispute = (dispute) => {
				return (dispute.defendant === defendant_id);
			};
			var existing_dispute = guild_obj.disputes.find(findDispute);
			if (existing_dispute){
				fulfill(constants.DISPUTE_EXISTS);
			}
			var new_dispute = {originator: originator_id, defendant:defendant_id, type:dispute_type, additional_info:add_info};
			guild_obj.disputes.push(new_dispute);
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

/* resolveDispute(guild_id, dispute_id)
 * -------------------------------------------------------
 * Attempts to look up guild with given id, then looks up
 * given dispute and removes it.
 *
 * If no tourney found, fulfills with NO_TOURNEY.
 * If no dispute found, fulfills with NO_DISPUTE.
 * If any errors occur during lookup or removal, rejects with error.
 *
 * Returns: Promise -- On success fulfills with REMOVE_SUCCESS
 * Usage:
 * db.resolveDispute(guild_id, dispute_id).then( (status) => {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.resolveDispute = (guild_id, dispute_id) => {
	return new Promise((fulfill, reject) => {
		var findDispute = (dispute) =>{
			return dispute._id === dispute_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			var disputeIndex = guild_obj.channels.findIndex(findDispute);
			if (disputeIndex === -1) {fulfill(constants.NO_DISPUTE);return;}
			guild_obj.disputes.splice(disputeIndex,1);
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

/* resolveDisputesByType(guild_id, dispute_type)
 * -------------------------------------------------------
 * Attempts to look up guild with given id, then looks up
 * given disputes and removes them.
 *
 * If no tourney found, fulfills with NO_TOURNEY.
 * If no disputes found, fulfills with NO_DISPUTE.
 * If any errors occur during lookup or removal, rejects with error.
 *
 * Returns: Promise -- On success fulfills with REMOVE_SUCCESS
 * Usage:
 * db.resolveDispute(guild_id, dispute_type).then( (status) => {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.resolveDisputesByType = (guild_id, dispute_type) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			if (!guild_obj.disputes.some( (disp) => {
				return disp.type === dispute_type;
			})) {
				fulfill(constants.NO_DISPUTE);
				return;
			}
			var disputes = guild_obj.disputes;
			disputes = disputes.reduce((p,c) => (c.type !== dispute_type && p.push(c),p),[]);
			guild_obj.disputes = disputes;
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

/* getDisputeID(guild_id, defendant_id)
 * -------------------------------------------------------
 * Attempts to look up guild with given id, then looks up
 * dispute with given defendant.
 *
 * If no tourney found, fulfills with NO_TOURNEY.
 * If no dispute found, fulfills with NO_DISPUTE.
 * If any errors occur during lookup or removal, rejects with error.
 *
 * Returns: Promise -- On success fulfills with dispute id
 * Usage:
 * db.resolveDispute(guild_id, defendant_id).then( (dispute_id) => {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getDisputeID = (guild_id, defendant_id) => {
	return new Promise((fulfill, reject) => {
		var findDispute = (dispute) =>{
			return dispute.defendant === defendant_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			var dispute = guild_obj.channels.find(findDispute);
			if (!dispute) {fulfill(constants.NO_DISPUTE);return;}
			fulfill(dispute._id);
		}).catch( (err) =>{
			Console.log(err);
			reject(err);
		});
	});
};

/* getDisputeByID(guild_id, dispute_id)
 * -------------------------------------------------------
 * Attempts to look up guild with given id, then looks up
 * dispute with given id.
 *
 * If no tourney found, fulfills with NO_TOURNEY.
 * If no dispute found, fulfills with NO_DISPUTE.
 * If any errors occur during lookup or removal, rejects with error.
 *
 * Returns: Promise -- On success fulfills with dispute object.
 * Usage:
 * db.resolveDispute(guild_id, defendant_id).then( (dispute_obj) => {
 * 		//DO STUFF
 * }).catch( (err) => {
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.getDisputeByID = (guild_id, dispute_id) => {
	return new Promise((fulfill, reject) => {
		var findDispute = (dispute) =>{
			return dispute._id === dispute_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then( (guild_obj) => {
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			var dispute = guild_obj.channels.find(findDispute);
			if (!dispute) {fulfill(constants.NO_DISPUTE);return;}
			fulfill(dispute);
		}).catch( (err) =>{
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
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
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
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			var channel = guild_obj.channels.find(findChannel);
			if (!channel){ fulfill(constants.NO_CHANNEL); return;}
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
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			var channelIndex = guild_obj.channels.findIndex(findChannel);
			if (channelIndex === -1) {fulfill(constants.NO_CHANNEL);return;}
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
			if (guild_obj === null) { fulfill(constants.NO_TOURNEY);return; }
			if (!guild_obj.channels.some(findChannel)) {fulfill(constants.NO_CHANNEL);return;}
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
