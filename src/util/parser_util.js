var parser_constants = require('./parse_constants');

exports = {};

exports.propToQuestion = (prop) =>{
	if (prop === 'guild_id'){ return 'pass';}
	if (prop === 'tourney_name'){ return 'NAME';}
	if (prop === 'tournament_type'){ return 'T_TYPE';}
	if (prop === 'teams'){ return 'TEAMS';}
	if (prop === 'signup_cap'){ return 'STARTUP_CAP';}
	return;
};

exports.tourneyTypeToString = (t_type) =>{
	if (t_type === parser_constants.SINGLE_ELIM){ return 'single elimination';}
	if (t_type === parser_constants.DOUBLE_ELIM){ return 'double elimination';}
	if (t_type === parser_constants.ROUND_ROBIN){ return 'round robin';}
	if (t_type === parser_constants.SWISS){ return 'swiss';}
	return null;
};

module.exports = exports;