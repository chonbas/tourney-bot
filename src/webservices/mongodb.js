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
 * If no guild found, attempt to create new tourney.
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
		}, function(err, guild_obj){
			if (!guild_obj){
				Guild.create({
					guild_id: guild_id,
				}, function(err, guildObj){
					if (err) { reject(err); }
					Console.log('Guild with guild_id:' + guild_id + ' created');
					fulfill(guildObj);
				});
			} else {
				reject('Guild already exists.');
			}
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
		}, function(err, guild_obj){
			if (err) { reject(err); }
			if (!guild_obj) { reject('' + guild_id + ' not found');}
			guild_obj.remove().then(function(guild_obj){
				fulfill('Guild with guild id:' + guild_obj.guild_id + ' removed from database.');
			}).catch(function(err){
				reject(err);
			});

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
		}, function(err, guild_obj){
			if (err) { reject(err); }
			if (!guild_obj){ reject('Not found'); }
			guild_obj.challonge_id = challonge_id;
			guild_obj.save().then(function(guild_obj){
				Console.log('ChallongeID set to:' + challonge_id +' for guild with id:' + guild_id);
				fulfill(guild_obj);
			}).catch(function(err){
				reject(err);
			});
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
		}, function(err, guild_obj){
			if (err) { reject(err); }
			if (!guild_obj){ reject('Tournament not found'); }
			var challonge_id = guild_obj.challonge_id;
			if (!challonge_id) { reject('Challonge ID is null'); }
			fulfill(challonge_id);
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
		}, function(err, guild_obj){
			if (err) { reject(err); }
			//if no tournament found, return no tourney
			if (!guild_obj) {
				fulfill(constants.NO_TOURNEY);
			// otherwise, determine tournament status
			} else {
				if(!guild_obj.challonge_id) {
					fulfill(constants.INIT_TOURNEY);
				}
				fulfill(constants.SETUP_TOURNEY);
				// TODO: actually get tournament status
				// this will be called a lot - maybe add status to DB?
				// tournament exists - look up status on challonge
				// should look kinda like this:
				/*
				challongeclient.tournaments.show({
					id: guildObj.challonge_id,
					callback: (err, data) => {
						if (err) { reject(err); }
						// not correct:
						// fulfill(data.status);
						fulfill();
					}
				});*/
			}
		});
	});
};

/* advanceTournamentState(guild_id)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.advanceTournamentState = (guild_id) => {
	return new Promise((fulfill, reject) => {
		// TODO: actually incrementTournamentStatus
		fulfill(guild_id);
		reject();
	});
};
/* getTournamentParticipants(guild_id)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.getTournamentParticipants = (guild_id) => {
	return new Promise((fulfill, reject) => {

	});
};
/* getTournamentChannels(guild_id)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.getTournamentChannels = (guild_id) => {
	return new Promise((fulfill, reject) => {

	});
};
/* createChannel(guild_id, channel_id, channel_type)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.createChannel = (guild_id, channel_id, channel_type) => {
	return new Promise((fulfill, reject) => {

	});
};

/* getChannelType(guild_id)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.getChannelType = (guild_id, channel_id) => {
	return new Promise((fulfill, reject) => {

	});
};

/* deleteChannel(guild_id, channel_id) 
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.deleteChannel = (guild_id, channel_id) => {
	return new Promise((fulfill, reject) => {

	});
};
/* createParticipant(guild_id, name, discord_id)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.createParticipant = (guild_id, name, discord_id) => {
	return new Promise((fulfill, reject) => {

	});
};
/* removeParticipant(guild_id, discord_id)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.removeParticipant = (guild_id, discord_id) => {
	return new Promise((fulfill, reject) => {

	});
};
/* getParticipantChallongeID(guild_id, discord_id)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
exports.getParticipantChallongeID = (guild_id, discord_id) => {
	return new Promise((fulfill, reject) => {

	});
};

exports.getParticipantDiscordID = (guild_id, challonge_id) => {
	return new Promise((fulfill, reject) => {

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
// TODO: createParticipant(???)
/* deleteTournament(guild_id)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
// TODO: getParticipant(???)
/* deleteTournament(guild_id)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
// TODO: removeParticipant(???)
/* deleteTournament(guild_id)
 * -------------------------------------------------------
 * 
 * -------------------------------------------------------
*/
// TODO: other functions...?

module.exports = exports;
