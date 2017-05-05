//
var constants = {
	'CONSTANT_MESSAGE': 'hello world',
	'NO_TOURNEY': 0,    // no tournament is set up
	'INIT_TOURNEY': 1,  // user is setting tournament params
	'SETUP_TOURNEY': 2, // players are joining tournament
	'RUN_TOURNEY': 3,   // tournament is in progress
	'CLOSE_TOURNEY': 4, // tournament is finished, perform clean/reset to none
	'DATABASE_ADDRESS':	'mongodb://localhost/test', // update to live when needeed
	'JURY_CHANNEL': 0,
	'GENERAL_CHANNEL': 1,
	'MATCH_CHANNEL': 2,
	'TEAM_CHANNEL': 3
};
//
module.exports = constants;