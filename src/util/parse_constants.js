var parse_constants = {
	'HELP': 0,
	'MATCH_REPORT_WIN': 1,
	'MATCH_REPORT_LOSE': 2,
	'MATCH_REPORT_AMBIGUOUS': 3,
	'JOIN_TOURNEY': 4,
	'CREATE_TOURNEY': 5,
	'INIT_TOURNEY' : 42,
	'START_TOURNEY': 6,
	'END_TOURNEY': 7,
	'DROP_TOURNEY': 8,
	'REPORT': 9,
	'VOTE_GUILTY': 10,
	'VOTE_INNOCENT': 11,
	'CHANGE_SETTINGS': 12,
	'YES': 13,
	'NO': 14,
	'RESOLVE': 25,

	'UNIDENTIFIED': 15, //below are constants for the init phase
	'NO_TEAMS': 16,
	'YES_TEAMS': 17,
	'SINGLE_ELIM': 18,
	'DOUBLE_ELIM': 19,
	'SWISS': 20,
	'ROUND_ROBIN': 21,
	'NO_CAP': 22,
	'CAP': 23,
	'DEFINE_NAME': 24,

};
//
module.exports = parse_constants;