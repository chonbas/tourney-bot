var parser_constants = require('./parse_constants');

module.exports.propToQuestion = (prop) =>{
	if (prop === 'guild_id'){ return 'pass';}
	if (prop === 'name'){ return parser_constants.NAME;}
	if (prop === 'tournament_type'){ return parser_constants.T_TYPE;}
	if (prop === 'teams'){ return parser_constants.TEAMS;}
	if (prop === 'signup_cap'){ return parser_constants.SIGNUP_CAP;}
	return;
};