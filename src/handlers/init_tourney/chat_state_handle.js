// eslint-disable-next-line
var Console = require('../../util/console');
// eslint-disable-next-line
var db = require('../../webservices/mongodb');
var constants = require('../../util/constants');
// var tourneyTypeToString = require('../../util/parser_util').tourneyTypeToString;

var STAGED_PROPS = constants.STAGED_PROPS;
var STAGED_REVERS = constants.STAGED_IND_TO_NAME;

var getTourneySummary = (staged_t) =>{
	var cur = 'Congratulations, you are done setting up your tournament. Does everything look right?\n';
	for (var ind = 0; ind < STAGED_PROPS.length - 1; ind++){
		var val  = staged_t[STAGED_PROPS[ind]];
		var prop_txt = STAGED_REVERS[ind];
		cur = cur + prop_txt + val +'\n';
	}
	return cur;
};

var getPrompt = (prop, staged_t) => {
	if (prop === 'Done'){ return 'Initializing tournament...';}
	if (prop === 'tourney_name'){ return 'What would you like the name of this tournament to be?';}
	if (prop === 'tournament_type'){ return 'What would you like the tournament type to be? Single-elimination, double-elimination, round robin or swiss?';}
	if (prop === 'teams'){ return 'Is the game being played 1v1?';}
	if (prop === 'signup_cap'){ return 'What is the maximum number of participants for this tournament? (Please enter 0 for unlimited participants)';}
	if (prop === 'confirmed'){ return getTourneySummary(staged_t);}
	return 'ruh roh something wrong with parsing->handling';
};


var extractParams = (staged_t, admin_id) => {
	return new Promise( (fulfill, reject) => {
		var params = {};
		params['name'] = staged_t.tourney_name;
		params['tournament_type'] = staged_t.tournament_type;
		if (staged_t.signup_cap > 0){
			params['signup_cap'] = staged_t.signup_cap;
		}
		params['open_signup'] = staged_t.open_signup; // THIS IS TO ENSURE NOONE CAN SIGN UP THROUGH CHALLONGE WEBSITE
		db.setTournamentTeamOption(staged_t.guild_id, staged_t.teams).then( () =>{
			db.setTournamentName(staged_t.guild_id, staged_t.tourney_name).then( () =>{
				db.setTournamentParticipantCap(staged_t.guild_id, staged_t.signup_cap).then( ()=>{
					db.setTournamentAdmin(staged_t.guild_id, admin_id).then( () => {
						db.removeStagedTourney(staged_t.guild_id).then( () => {
							fulfill(params);
						}).catch( err => reject(err));
					}).catch( err => reject(err));
				}).catch( err => reject(err));
			}).catch( err => reject(err));
		}).catch( err => reject(err));
	});
};

var generateReply = (staged_t, admin_id) => {
	return new Promise( (fulfill, reject) => {
		var next = {};
		for (var i in STAGED_PROPS){
			var prop = STAGED_PROPS[i];
			if (prop in staged_t && staged_t[prop] === null){
				next.msg = getPrompt(prop, staged_t);
				next.done = false;
				next.params = {};
				fulfill(next);
				return;
			}
		}
		next.msg = getPrompt('Done');
		next.done = true;
		extractParams(staged_t, admin_id).then( (params) => {
			next.params = params;
			fulfill(next);
		}).catch( (err) => reject(err));
	});
};

var confirmMessage = (prop, val) => {
	if (prop === 'tourney_name'){ return 'Got it. Tournament name is: ' + val;}
	if (prop === 'tournament_type'){return 'Got it. The tourney type is :' + val;}
	if (prop === 'teams'){
		if (val){
			return 'Got it. The game type involves teams of more than one person.';
		}
		return 'Got it. The game type is 1v1.';
	}
	if (prop === 'signup_cap'){
		if (val > 0){
			return 'Got it. The tourney cap is :' + val;
		}
		return 'Got it. Tourney is open to an unlimited number of participants.';
	}
	return 'ruh roh something wrong with parsing->handling';
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
					msg.reply(confirmMessage(prop, data[prop]));
					staged_t[prop] = data[prop];
				}
			}
			staged_t.save().then( () =>{
				generateReply(staged_t, msg.author.id).then( (next) => {
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
