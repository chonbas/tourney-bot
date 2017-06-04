// eslint-disable-next-line
var Console = require('../../util/console');
// eslint-disable-next-line
var db = require('../../webservices/mongodb');
var constants = require('../../util/constants');
var parser_constants = require('../../util/parse_constants');

//NAME
//T_TYPE
//TEAMS
//SIGNUP_CAP
//START_AT

var generateReply = (prop) =>{

};
// var staged_tourney_schema = new mongoose.Schema({
// 	guild_id:{type:String, index:true, unique:true},
// 	name:{type:String, default:null},
// 	tournament_type:{type:Number, default:null}, //Use constants
// 	teams: {type:Boolean, default:null},
// 	signup_cap:{type:Number, default:null}, //Use constants,//Max users
// 	start_at:{type:Date, default:null}, //Use constants,
// 	open_signup: {type:Boolean, default:false}
// });
// db.getStagedQuestion

var propToQuestion = (prop) =>{
	if (prop === 'guild_id'){ return 'pass';}
	if (prop === 'name'){ return parser_constants.NAME;}
	if (prop === 'tournament_type'){ return parser_constants.T_TYPE;}
	if (prop === 'teams'){ return parser_constants.TEAMS;}
	if (prop === 'signup_cap'){ return parser_constants.SIGNUP_CAP;}
	if (prop === 'start_at'){ return parser_constants.START_AT;}
	return;
};
var generateReply = (staged_t) => {
	
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
