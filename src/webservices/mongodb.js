//
var mongoose = require('mongoose');
var constants = require('../util/constants');
const Console = require('../util/console');
var Guild = require('./schemas/guildSchema.js');

var exports = {};

//initialize database, and report access
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', (err) =>{
	Console.error.bind(Console, 'connection error:');
	Console.log(err);
	Console.log('\n\nYou must be running MongoDB. If you are, check the error above for more information.');
});
db.once('open', () => {
	Console.log('Connected to MongoDB.');
});

// make tournament-making easy
exports.createTournament = (guild_id, challonge_id) => {
	return new Promise((fulfill, reject) => {
		Guild.create({
			guild_id: guild_id,
			challonge_id: challonge_id,
		}, function(err, guildObj){
			if (err) { reject(err); }
			Console.debug('Made tournament');
			Console.log(guildObj);
			fulfill(guildObj);
		});
	});
};

exports.getTournamentStatus = () => {
	Console.log('Get tournament status ran');
	// return int 0 - 3
	switch(Math.floor(Math.random() * 4)){
	case 0: return constants.NO_TOURNEY;
	case 1: return constants.INIT_TOURNEY;
	case 2: return constants.SETUP_TOURNEY;
	case 3: return constants.RUN_TOURNEY;
	case 4: return constants.CLOSE_TOURNEY;
	}
};

module.exports = exports;
