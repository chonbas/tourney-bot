// eslint-disable-next-line
var Console = require('../../util/console');
// eslint-disable-next-line
var db = require('../../webservices/mongodb');
var constants = require('../../util/constants');
var propToQuestion = require('../../util/parse_util').propToQuestion;

var getPrompt = (prop) => {
	if (prop === 'Done'){ return 'Initializing tournament...';}
	if (prop === 'name'){ return 'What would you like the name of this tournament to be?';}
	if (prop === 'tournament_type'){ return 'What would you like the tournament type to be? Single-elimination, double-elimination, round robin or swiss?';}
	if (prop === 'teams'){ return 'Is the game being played 1v1?';}
};
var tourneyTypeToString = (t_type) =>{
	return t_type;
};

var extractParams = (staged_t) => {
	var params = {};
	params['name'] = staged_t.name;
	params['tournament_type'] = tourneyTypeToString(staged_t.tournament_type);
	db.setTourneyTeams(staged_t.guild_id, staged_t.teams).then( () =>{
		db.setTourneyName(staged_t.guild_id, staged_t.name).then( () =>{
			return params;
		}).catch( err => Console.log(err));
	}).catch( err => Console.log(err));
};

var generateReply = (staged_t) => {
	var next = {};
	for (var prop in staged_t){
		if (staged_t[prop] === null){
			next.msg = getPrompt(prop);
			next.done = false;
			next.params = {};
			return next;
		}
	}
	next.msg = getPrompt('Done');
	next.done = true;
	next.params = extractParams(staged_t);
	return next;
};

var updateChatState = (msg, data) => {
	return new Promise((fulfill, reject) => {
		var data_status = {};
		var guild_id = msg.guild.id;
		db.getStagedTourney(guild_id).then( (staged_t) => {
			if (staged_t === constants.NO_TOURNEY){
				Console.log('No staged tourney was created.');
				reject('No staged tourney');
			}
			for (var prop in staged_t){
				if (data.question === propToQuestion(prop)){
					staged_t.prop = msg.parsed_msg.parse;
					staged_t.save().then( () =>{
						var next = generateReply(staged_t);
						msg.reply(next.msg);
						data_status.done = next.done;
						data_status.params = next.params;
						fulfill(data_status);
						return;
					}).catch( (err) =>{
						Console.log(err);
						reject(err);
					});
				}
			}
			data_status.done = false;
			fulfill(data_status);
			return;
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

module.exports = updateChatState;
