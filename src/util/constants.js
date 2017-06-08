//
var constants = {
	'DEBUG': false, // DEBUG FLAG USED TO RUN TESTS
	'MONGO_DEBUG': true, //MONGO DEBUG FLAG USED TO LOG ALL MONGO OPS

	'MAX_STASH_URL_LENGTH': 20, //Length of hashed url once tourney is stashed
	// tournament statuses
	'NO_TOURNEY': 0,    // no tournament is set up
	'INIT_TOURNEY': 1,  // user is setting tournament params
	'SETUP_TOURNEY': 2, // players are joining tournament
	'RUN_TOURNEY': 3,   // tournament is in progress
	'CLOSE_TOURNEY': 4, // tournament is finished, perform clean/reset to none


	// running tournament statuses
	'RECEIVING_MATCH_REPORTS': 0,
	'RESOLVING_DISPUTES': 1,
	'ADVANCING': 2,

	// channel types
	'NO_CHANNEL': 901, //channel does not exist
	'INIT_CHANNEL': 907, //where init-er tells bot about tourney params
	'JOIN_CHANNEL': 908, //where people say they want to join
	'JURY_CHANNEL': 902, //channel used for dispute resolution
	'GENERAL_CHANNEL': 903, //used for general tourney chat
	'MATCH_CHANNEL': 904, //individual match channels
	'TEAM_CHANNEL': 905, //individual team channels
	'ANNOUNCE_CHANNEL':906, //individual channel for announcements, only bot can talk here

	// emoji confirmation types
	'EMOJI_YES': 'EMOJI_YES',
	'EMOJI_MAYBE': 'EMOJI_MAYBE',
	'EMOJI_NO': 'EMOJI_NO',
	'EMOJI_COUNTS': 'EMOJI_COUNTS',
	'EMOJI_INVALID': 'EMOJI_INVALID', //ignore


	'STAGED_PROPS': ['tourney_name', 'tournament_type','teams','signup_cap'],
	//Dispute Types
	'DISPUTE_CHEAT':0,
	'DISPUTE_DC':1,

	//DB statuses
	'UPDATE_SUCCESS': 0,
	'REMOVE_SUCCESS': 1,
	'CREATE_SUCCESS':2,
	'NO_PARTICIPANT':3,
	'NO_TEAM':4,
	'NO_DISPUTE':5,
	'PARTICIPANT_IN_TEAM':6,
	'DISPUTE_EXISTS':7,
	'TEAM_EXISTS':8,

	// other constants
	'CONSTANT_MESSAGE': 'hello world',

	'DATABASE_ADDRESS':	'mongodb://localhost/test' // update to live when needeed
};
//
module.exports = constants;
