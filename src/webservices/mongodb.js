//
var mongoose = require('mongoose');
var constants = require('../util/constants');
const Console = require('../util/console');
var Guild = require('./schemas/guildSchema.js')

mongoose.connect('mongodb://localhost/test');
//
// Connect to the db
var startMongodbClient = () => {
	return new Promise((fulfill, reject) => {
		var db = mongoose.connection;

		db.on('error', (err) =>{
			Console.error.bind(Console, 'connection error:');
			Console.log(err); 
			Console.log('\n\nYou must be running MongoDB. If you are, check the error above for more information.');
			reject(err);
		});

		db.once('open', (res) => {
			Console.log('Connected to MongoDB.');
			fulfill(res);
			Guild.create({
				guild_id: 'test',
				challonge_id: 'test',
			}, function(err, guildObj){
				Console.log(guildObj);
			});
		});
	});
};

var getTournamentStatus = () => {
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

module.exports = { 
	startMongodbClient,
	getTournamentStatus
};