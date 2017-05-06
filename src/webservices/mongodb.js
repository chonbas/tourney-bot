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


// ████████████████████████████████████████████████████
// FUNCTIONS!!!
// BELOW HERE ARE FUNCTIONS FOR EVERYONE TO CALL :-D
// TODO: add comments describing what each function does
// TODO? maybe make a list right here of fxn to call?
// ████████████████████████████████████████████████████

/* createTournament(guild_id)
 * -------------------------------------------------------
 * Takes guild_id and first checks if the guild is already
 * in the db -- if it is, then reject the creation as each
 * guild can only have one active tourney.
 * If no guild found, attempt to create new tourney and set
 * its state to INIT_TOURNEY to start.
 * Returns: Promise
 * Usage:
 * db.createTournament(guild_id).then(function(err, guild_obj){
 * 		//DO STUFF
 * });
 * -------------------------------------------------------
*/
exports.createTournament = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id: guild_id,
		}).then(function(guild_obj){
			if (!guild_obj){
				Guild.create({
					guild_id: guild_id,
					tourney_state: constants.INIT_TOURNEY
				}).then(function(){
					Console.log('Guild with guild_id:' + guild_id + ' created');
					fulfill(guild_id);
				}).catch((err)=>{
					Console.log(err);
				});
			}else {
				reject('Guild already exists.');
			}
		}).catch((err)=>{
			Console.log(err);
		});
		
	});
};

/* deleteTournament(guild_id)
 * -------------------------------------------------------
 * Takes guild_id and first tries to find tournament in db,
 * if guild is found, the tournament is removed. If guild 
 * is not found, the promise rejects and an error is returned.
 * If the remove operation fails, promise also rejects
 * and error is returned.
 * Returns: Promise
 * db.deleteTournament(guild_id).then(function(err, data){
 * 		//DO STUFF
 * });
 * -------------------------------------------------------
*/


exports.deleteTournament = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id: guild_id,
		}).then(function(guild_obj){
			Console.log(guild_obj);
			if (guild_obj == null){ 
				reject('Guild ' + guild_id + ' not found');
			} else {
				guild_obj.remove().then(function(guild_obj){
					fulfill('Guild with guild id:' + guild_obj.guild_id + ' removed from database.');
				}).catch(function(err){
					reject(err);
				});
			} 
		}).catch((err)=>{
			Console.log(err);
		});
	});
};

/* setChallongeID(guild_id, challonge_id)
 * -------------------------------------------------------
 * Attempts to find the guild with the given id, if 
 * guild not found
 * -------------------------------------------------------
*/
exports.setChallongeID = (guild_id, challonge_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id: guild_id,
		}).then(function(guild_obj){
			if (!guild_obj){ reject('Not found'); }
			guild_obj.challonge_id = challonge_id;
			guild_obj.save().then(function(){
				Console.log('ChallongeID set to:' + challonge_id +' for guild with id:' + guild_id);
				fulfill(guild_obj);
			}).catch(function(err){
				reject(err);
			});
		}).catch( (err) => {
			Console.log(err);
		});
	});
};

/* getChallongeID(guild_id)
 * -------------------------------------------------------
 * Attempts to find the guild with the given id,
 * and if that guild's challonge id is not null, the promise
 * is fulfilled and the challonge id is returned.
 * If tourney not found, challonge id is null, or any other error
 * occurs, the promise will be rejected.
 * Usage:
 * var guild_challonge_id = db.getChallongeID(guild_id);
 * -------------------------------------------------------
*/
exports.getChallongeID = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id: guild_id,
		}).then(function(guild_obj){
			if (!guild_obj){ reject('Tournament not found'); }
			var challonge_id = guild_obj.challonge_id;
			if (!challonge_id) { reject('Challonge ID is null'); }
			fulfill(challonge_id);
		}).catch( (err) => {
			Console.log(err);
		});
	});
};

/* getTournamentStatus(guild_id)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.getTournamentStatus = (guild_id) => {
	return new Promise((fulfill, reject) => {
		// get the relevant tournament
		Guild.findOne({
			guild_id: guild_id
		}).then(function(guild_obj){
			//if no tournament found, return no tourney
			if (!guild_obj) {
				reject(constants.NO_TOURNEY);
			// otherwise, determine tournament status
			} else {
				var tourney_state = guild_obj.tourney_state;
				fulfill(tourney_state);
			}
		}).catch( (err) => {
			Console.log(err);
		});
	});
};

/* advanceTournamentState(guild_id)
 * -------------------------------------------------------
 * Attempts to find guild with given guild_id,
 * if any errors occur or the guild doesn't exist, the 
 * promise is rejected.
 * If a guild is found then, if the tourney was in it final state
 * the ghuild is removed.
 * Otherwise, the tourney state is advanced to the next stage
 * and the guild object is returned.
 * Usage:
 * 
 * db.advanceTournamentState(guild_id).then(function(guild_obj){
 * 		//DO STUFF!
 * }).catch(function(err){
 * 		/error handling
 * });
 * -------------------------------------------------------
*/
exports.advanceTournamentState = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then(function(guild_obj){
			if (!guild_obj) { reject('No tourney found.');}
			var current_state = guild_obj.tourney_state;
			if (current_state === constants.CLOSE_TOURNEY){
				exports.deleteTournament(guild_id).then(function(data){
					fulfill(data);
				}).catch(function(err){
					reject(err);
				});
			} else {
				current_state++;
				guild_obj.tourney_state = current_state;
				guild_obj.save().then(function(){
					fulfill('Tourney Advanced to ' + current_state);
				}).catch(function(err){
					reject(err);
				});
				
			}
		}).catch( (err) => {
			Console.log(err);
		});
	});
};

/* getTournamentParticipants(guild_id)
 * -------------------------------------------------------
 * Attempts to find a guild by guild_id, if the guild is found
 * then retrieve the array of participants and return upon
 * fulfillment. Any no tourney is found, or the tourney has no 
 * participants, or if any errors occur, the promise is rejected.
 * 
 * Usage:
 * db.getTournamentParticipants(guild_id).then(function(participants){
 * 	///do stuff
 * }).catch(function(err){
 * 	/error handling
 * });
 * -------------------------------------------------------
*/
exports.getTournamentParticipants = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then(function(guild_obj){
			if (!guild_obj) { reject('No tourney found.');}
			var participants = guild_obj.participants;
			if (participants.length === 0) {reject('Tourney has no participants');}
			fulfill(participants);
		}).catch(function(err){
			reject(err);
		});
	});
};

/* getTournamentChannels(guild_id)
 * -------------------------------------------------------
 * Attempts to find a guild by guild_id, if the guild is found
 * then retrieve the array of channels and return upon
 * fulfillment. Any no tourney is found, or the tourney has no 
 * channels, or if any errors occur, the promise is rejected.
 * 
 * Usage:
 * db.getTournamentParticipants(guild_id).then(function(channels){
 * 	///do stuff
 * }).catch(function(err){
 * 	/error handling
 * });
 * -------------------------------------------------------
*/
exports.getTournamentChannels = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then(function(guild_obj){
			if (!guild_obj) { reject('No tourney found.');}
			var channels = guild_obj.channels;
			if (channels.length === 0) {reject('Tourney has no channels');}
			fulfill(channels);
		}).catch(function(err){
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
 * Returns a success message.
 * Usage:
 * db.createParticipant(guild_id, name, discord_id).then(function(data){
 * 	//do stuff
 * }).catch(function(err){
 * 	//error handling
 * })
 * -------------------------------------------------------
*/
exports.createParticipant = (guild_id, name, discord_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then(function(guild_obj){
			if (!name || 0 === name.length){
				Console.log('Must Provide a name for participant.');
				reject('Must provide a name for participant');
			}
			if (!discord_id || 0 === discord_id.length){
				Console.log('Must Provide a discord id for participant.');
				reject('Must provide a discord id for participant');
			}
			var new_participant = {name:name, ids:{discord_id:discord_id}};
			guild_obj.participants.push(new_participant);
			guild_obj.save().then(function(){
				fulfill('Participant "' + name+'" added to guild with id:'+guild_id);
			}).catch(function(err){
				reject(err);
			});
		}).catch(function(err){
			reject(err);
		});
	});
};
/* removeParticipant(guild_id, discord_id)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.removeParticipant = (guild_id, discord_id) => {
	return new Promise((fulfill, reject) => {
		var findParticipant = (participant) =>{
			return participant.ids.discord_id === discord_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then(function(guild_obj){
			var participantIndex = guild_obj.participants.findIndex(findParticipant);
			if (participantIndex === -1) {reject('Participant not found.');}
			guild_obj.participants.splice(participantIndex,1);
			guild_obj.save(function(){
				fulfill('Participant with discord_id '+ discord_id +' removed from guild with id:'+guild_id);
			}).catch(function(err){
				reject(err);
			});
		}).catch(function(err){
			reject(err);
		});
	});
};
/* getParticipantChallongeID(guild_id, discord_id)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.setParticipantChallongeID = (guild_id, discord_id, challonge_id) => {
	return new Promise((fulfill, reject) => {
		var findParticipant = (participant) =>{
			return participant.ids.discord_id === discord_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then(function(guild_obj){
			var participant = guild_obj.participants.find(findParticipant);
			if (!participant){reject('Participant ' + discord_id + ' not found.');}
			participant.ids.challonge_id = challonge_id;
			guild_obj.save(function(){
				fulfill('Participant ' + discord_id + ' now has challonge id:'+challonge_id);
			}).catch(function(err){
				reject(err);
			});
		}).catch(function(err){
			reject(err);
		});
	});
};

/* setParticipantChallongeID(guild_id, discord_id)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.getParticipantChallongeID = (guild_id, discord_id) => {
	return new Promise((fulfill, reject) => {
		var findParticipant = (participant) =>{
			return participant.ids.discord_id === discord_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then(function(guild_obj){
			var participant = guild_obj.participants.find(findParticipant);
			if (!participant){reject('Participant ' +discord_id +' not found.');}
			if (!participant.ids.challonge_id){reject('This participant currently has no Challonge ID');}
			fulfill(participant.ids.challonge_id);
		}).catch(function(err){
			reject(err);
		});
	});
};

/* getParticipantDiscordID(guild_id, discord_id)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.getParticipantDiscordID = (guild_id, challonge_id) => {
	return new Promise((fulfill, reject) => {
		var findParticipant = (participant) =>{
			return participant.ids.challonge_id === challonge_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then(function(guild_obj){
			var participant = guild_obj.participants.find(findParticipant);
			if (!participant){reject('Participant not found.');}
			fulfill(participant.ids.discord_id);			
		}).catch(function(err){
			reject(err);
		});
	});
};

/*
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.getParticipantRoleID = (guild_id, discord_id) => {
	return new Promise((fulfill, reject) => {
		var findParticipant = (participant) =>{
			return participant.ids.discord_id === discord_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then(function(guild_obj){
			var participant = guild_obj.participants.find(findParticipant);
			if (!participant){reject('Participant not found.');}
			if (!participant.ids.role_id){reject('This participant currently has no Role ID');}
			fulfill(participant.ids.discord_id);
		}).catch(function(err){
			reject(err);
		});
	});
};

/*
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.getParticipantsByRoleID = (guild_id, role_id) => {
	return new Promise((fulfill, reject) => {
		var findParticipant = (participant) =>{
			return participant.ids.role_id === role_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then(function(guild_obj){
			
		}).catch(function(err){
			reject(err);
		});
	});
};
/* createChannel(guild_id, channel_id, channel_type)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.createChannel = (guild_id, channel_id, channel_type, ref_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id:guild_id
		}).then(function(guild_obj){
			if (!channel_type){
				reject('Must Provide a channel type.');
			}
			if (!channel_id || 0 === channel_id.length){
				reject('Must Provide a channel id.');
			}
			var new_channel = {channel_type: channel_type, channel_id:channel_id, ref_id:ref_id};
			guild_obj.channels.push(new_channel);
			guild_obj.save().then(function(){
				fulfill('Channel ' + channel_id +' added to guild with id:'+guild_id);
			}).catch(function(err){
				reject(err);
			});
		}).catch(function(err){
			reject(err);
		});
	});
};

/* getChannelType(guild_id, channel_id)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.getChannelType = (guild_id, channel_id) => {
	return new Promise((fulfill, reject) => {
		var findChannel = (channel) =>{
			return channel.channel_id === channel_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then(function(guild_obj){
			var channel = guild_obj.channels.find(findChannel);
			if (!channel){
				reject('Participant not found.');
			} else {
				fulfill(channel.channel_type);
			} 
		}).catch(function(err){
			reject(err);
		});
	});
};

/* deleteChannel(guild_id, channel_id) 
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.deleteChannel = (guild_id, channel_id) => {
	return new Promise((fulfill, reject) => {
		var findChannel = (channel) =>{
			return channel.channel_id === channel_id;
		};
		Guild.findOne({
			guild_id:guild_id
		}).then(function(guild_obj){
			var channelIndex = guild_obj.channels.findIndex(findChannel);
			if (channelIndex === -1) {reject('channel not found.');}
			guild_obj.channels.splice(channelIndex,1);
			guild_obj.save(function(){
				fulfill('channel with channel_id '+ channel_id +' removed from guild with id:'+guild_id);
			}).catch(function(err){
				reject(err);
			});
		}).catch(function(err){
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
