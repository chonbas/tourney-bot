/*
Constants internal to the discord client.
Do not require this.
*/
var constants = {
	'EMOJI_YES_RAW': '✅',
	'EMOJI_MAYBE_RAW': '🤔',
	'EMOJI_NO_RAW': '❌',
	'EMOJI_YN': ['✅','❌'],
	'EMOJI_YNM': ['✅','🤔','❌'],

	//announce constants
	'SETUP_PHASE': '[constants: SETUP_PHASE]',
	'MATCH_PHASE': '[constants: MATCH_PHASE]',
	'DISPUTE_PHASE': '[constants: RUN_PHASE]',
	'DONE_PHASE': '[constants: DONE_PHASE]',

	// kinds of messages that can require a confirmation
	// ask people who say init if they're sure (not implemented)
	'INIT_MESSAGE': 'confirm-init',
	//ask team leader if player can join
	'TEAM_LEADER_JOIN_MESSAGE': 'confirm-team-join',
	//ask opponents if correct
	'MATCH_REPORT_MESSAGE': 'match-report-confirmation',
	//get vote counts
	'VOTEKICK_MESSAGE': 'votekick-counter-message',
};
//
module.exports = constants;
