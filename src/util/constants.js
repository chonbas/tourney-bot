//
var constants = {
	'CONSTANT_MESSAGE': 'hello world',
	'NO_TOURNEY': 'a',    // no tournament is set up
	'INIT_TOURNEY': 'b',  // user is setting tournament params
	'SETUP_TOURNEY': 'c', // players are joining tournament
	'RUN_TOURNEY': 'd',   // tournament is in progress
	'CLOSE_TOURNEY': 'e', // tournament is finished, perform clean/reset to none
};
//
module.exports = constants;