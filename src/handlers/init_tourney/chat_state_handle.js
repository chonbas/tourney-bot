// eslint-disable-next-line
var Console = require('../../util/console');
// eslint-disable-next-line
var db = require('../../webservices/mongodb');
var constants = require('../../util/constants');
// var tourneyTypeToString = require('../../util/parser_util').tourneyTypeToString;

var STAGED_PROPS = constants.STAGED_PROPS;

var getPrompt = (prop) => {
	if (prop === 'Done'){ return 'Initializing tournament...';}
	if (prop === 'name'){ return 'What would you like the name of this tournament to be?';}
	if (prop === 'tournament_type'){ return 'What would you like the tournament type to be? Single-elimination, double-elimination, round robin or swiss?';}
	if (prop === 'teams'){ return 'Is the game being played 1v1?';}
	if (prop === 'signup_cap'){ return 'What is the maximum number of participants for this tournament? (Please enter -1 for unlimited participants)';}
	return 'sup';
};


var extractParams = (staged_t) => {
	return new Promise( (fulfill, reject) => {
		var params = {};
		params['name'] = staged_t.tourney_name;
		params['tournament_type'] = staged_t.tournament_type;
		// params['signup_cap'] = staged_t.signup_cap;
		// params['open_signup'] = staged_t.open_signup; // THIS IS TO ENSURE NOONE CAN SIGN UP THROUGH CHALLONGE WEBSITE
		// db.setTournamentTeamOption(staged_t.guild_id, staged_t.teams).then( () =>{
		db.setTournamentName(staged_t.guild_id, staged_t.tourney_name).then( () =>{
			// db.setTournamentParticipantCap(staged_t.guild_id, staged_t.signup_cap).then( ()=>{
			db.removeStagedTourney(staged_t.guild_id).then( () => {
				fulfill(params);
			}).catch( err => reject(err));
			// }).catch( err => Console.log(err));
		}).catch( err => reject(err));
		// }).catch( err => Console.log(err));
	});
};

var generateReply = (staged_t) => {
	return new Promise( (fulfill, reject) => {
		var next = {};
		for (var i in STAGED_PROPS){
			var prop = STAGED_PROPS[i];
			if (prop in staged_t && staged_t[prop] === null){
				next.msg = getPrompt(prop);
				next.done = false;
				next.params = {};
				fulfill(next);
				return;
			}
		}
		next.msg = getPrompt('Done');
		next.done = true;
		extractParams(staged_t).then( (params) => {
			next.params = params;
			fulfill(next);
		}).catch( (err) => reject(err));
	});
};

var updateChatState = (msg) => {
	return new Promise((fulfill, reject) => {
		var data = msg.parsed_msg.data_object;
		var data_status = {};
		var guild_id = msg.guild.id;
		db.getStagedTourney(guild_id).then( (staged_t) => {
			if (staged_t === constants.NO_TOURNEY){
				Console.log('No staged tourney was created.');
				reject('No staged tourney');
			}
			for (var i in STAGED_PROPS){
				var prop = STAGED_PROPS[i];
				if (prop in data){
					staged_t[prop] = data[prop];
				}
			}
			staged_t.save().then( () =>{
				generateReply(staged_t).then( (next) => {
					msg.reply(next.msg);
					data_status.done = next.done;
					data_status.params = next.params;
					fulfill(data_status);
					return;
				}).catch((err)=>reject(err));
			}).catch( (err) =>{
				Console.log(err);
				reject(err);
			});
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

module.exports = updateChatState;
