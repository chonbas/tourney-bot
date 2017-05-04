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

// make tournament-making easy
exports.createTournament = (guild_id) => {
	return new Promise((fulfill, reject) => {
		Guild.create({
			guild_id: guild_id,
		}, function(err, guildObj){
			if (err) { reject(err); }
			Console.debug('Made tournament');
			Console.log(guildObj);
			fulfill(guildObj);
		});
	});
};

// TODO: deleteTournament(guild_id)
// for cleanup when a tournament is done

exports.setChallongeID = (guild_id, challonge_id) => {
	return new Promise((fulfill, reject) => {
		Guild.findOne({
			guild_id: guild_id,
		}, function(err, guild_obj){
			if (err) { reject(err); }
			if (!guild_obj){ reject('Not found'); }
			guild_obj.challonge_id = challonge_id;
			guild_obj.save();
			fulfill('Set id to ' + challonge_id);
		});
	});
};

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
				if(guild_obj.challonge_id == null) {
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

//unsure about how this works, sorry!
exports.incrementTournamentStatus = (guild_id) => {
	return new Promise((fulfill, reject) => {
		// TODO: actually incrementTournamentStatus
		fulfill(guild_id);
		reject();
	});
};

// TODO: createChannel(channel_id)
// not sure if guild_id is needed

// TODO: getChannelType()

// TODO: createChatState(???)
// actually maybe isn't necessary but am not sure

// TODO: getChatState(???)
// returns a chat state object.
// Users: be sure to obj.save()!!

// TODO: createParticipant(???)

// TODO: getParticipant(???)

// TODO: removeParticipant(???)

// TODO: other functions...?

module.exports = exports;
