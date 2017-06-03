/**
RUN TOURNEY HANDLER

This handler delegates responsibility to the handlers
in handlers.

*/

const discord = require('../../webservices/discord');
const challonge = require('../../webservices/challonge');
const constants = require('../../util/constants');
const parse_constants = require('../../util/parse_constants');
const Console = require('../../util/console');
const prep_round = require('./prepare_open_matches');
const handle_it = require('./handle_report_message');
const handle_disputes = require('./disputes');



var handler = {};

handler.handleMsg = (msg) => {
	// Check for dispute
	Console.debug('handler for run-tourney checking in');
	if(msg.parsed_msg.parse == parse_constants.MATCH_REPORT_WIN){
		handle_it(msg, true);
	}else if (msg.parsed_msg.parse == parse_constants.MATCH_REPORT_LOSE) {
		handle_it(msg, false);
	}else if (msg.parsed_msg.parse == parse_constants.MATCH_REPORT_AMBIGUOUS){
		msg.reply('I think you\'re trying to report a match but i don\'t understand');
	}else if (msg.parsed_msg.parse == parse_constants.REPORT) {
		handle_disputes(msg);
	}
};

handler.handleReaction = (msgRxn, user) => {
	Console.debug('handler for run-tourney: reaction detected!');
	discord.receiveConfirmMatchReport(msgRxn, user)
	.then((answer) => {
		if(answer.status == constants.EMOJI_YES){
			Console.log('MATCH REPORT CONFIRMED!!');
			var guild_id = msgRxn.message.guild.id;
			var match_id = answer.payload.challonge_match_id;
			var winner_id = answer.payload.winner_challonge_id;
			var scores = '1-0';
			challonge.updateMatch(guild_id, match_id, winner_id, scores)
			// After updating match, check to see if tournament is finished, if so advance tournament state, else prep_round
			.then(() => {
				prep_round(msgRxn.message.guild, 1);
			})
			.catch(err => Console.log(err));
		}
		if(answer.status == constants.EMOJI_NO){
			// Follow up with question about wanting to report
			Console.log('MATCH REPORT REJECTED!!');
		}
	})
	.catch(err => Console.log(err));
};

module.exports = handler;
