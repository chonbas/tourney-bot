//
var constants = {
	'DEBUG': false, // DEBUG FLAG USED TO RUN TESTS
	'MONGO_DEBUG': true, //MONGO DEBUG FLAG USED TO LOG ALL MONGO OPS
	// tournament statuses
	'NO_TOURNEY': 0,    // no tournament is set up
	'INIT_TOURNEY': 1,  // user is setting tournament params
	'SETUP_TOURNEY': 2, // players are joining tournament
	'RUN_TOURNEY': 3,   // tournament is in progress
	'CLOSE_TOURNEY': 4, // tournament is finished, perform clean/reset to none

	//RUN_TOURNEY sub states
	'STATE_MATCH':0, //
	'STATE_ADV_MATCH':1,//..
	'STATE_DISPUTE':2, //..
	'STATE_ADV_DISPUTE':3,

	// channel types
	'NO_CHANNEL': 0, //channel does not exist
	'JURY_CHANNEL': 0, //channel used for dispute resolution
	'GENERAL_CHANNEL': 1, //used for general tourney chat
	'MATCH_CHANNEL': 2, //individual match channels
	'TEAM_CHANNEL': 3, //individual team channels
	'ANNOUNCE_CHANNEL':4, //individual channel for announcements, only bot can talk here

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
