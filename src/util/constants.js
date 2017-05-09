//
var constants = {
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
	'NO_CHANNEL': 0, //channel does not exist
	'JURY_CHANNEL': 0, //channel used for dispute resolution
	'GENERAL_CHANNEL': 1, //used for general tourney chat
	'MATCH_CHANNEL': 2, //individual match channels
	'TEAM_CHANNEL': 3, //individual team channels


	//DB statuses
	'UPDATE_SUCCESS': 0,
	'REMOVE_SUCCESS': 1,
	'CREATE_SUCCESS':2,
	'NO_PARTICIPANT':3,

	// other constants
	'CONSTANT_MESSAGE': 'hello world',

	'DATABASE_ADDRESS':	'mongodb://localhost/test' // update to live when needeed
};
//
module.exports = constants;
