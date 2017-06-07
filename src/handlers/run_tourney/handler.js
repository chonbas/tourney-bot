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
const process_winner = require('./process_winner');
const initiate_dispute = require('./initiate_dispute');
const resolve_dispute = require('./resolve_dispute');
const message_text = require('../../util/message_text');


var handler = {};

handler.handleMsg = (msg) => {
	// Check for dispute
	Console.debug('handler for run-tourney checking in');
	if (msg.parsed_msg.parse == parse_constants.MATCH_REPORT_WIN){
		handle_it(msg, true);
	} else if (msg.parsed_msg.parse == parse_constants.MATCH_REPORT_LOSE) {
		handle_it(msg, false);
	} else if (msg.parsed_msg.parse == parse_constants.MATCH_REPORT_AMBIGUOUS){
		msg.reply('I think you\'re trying to report a match but i don\'t understand');
	} else if (msg.parsed_msg.parse == parse_constants.REPORT) {
		initiate_dispute(msg, msg.parsed_msg.data_object.reported_user);
	}
};

handler.handleReaction = (msgRxn, user) => {
	Console.debug('handler for run-tourney: reaction detected!');
	// Parse out whether the msgRxn is a match report or dipsute vote
	var dispute_channel = msgRxn.message.guild.channels.find('name','tourney-dispute');
	if (msgRxn.message.channel.id == dispute_channel.id) {
		Console.log('Dispute reaction detected!');
		resolve_dispute(msgRxn, user)
		.then((data) => {
			if (data.winner_team_id != null) {
				process_match(msgRxn, data.guild_id, data.match_id, data.winner_team_id, data.scores);
			}
		})
		.catch(err => Console.log(err));
	} else {
		discord.receiveConfirmMatchReport(msgRxn, user)
		.then((answer) => {
			if(answer.status == constants.EMOJI_YES){
				Console.log('MATCH REPORT CONFIRMED!!');
				var guild_id = msgRxn.message.guild.id;
				var match_id = answer.payload.challonge_match_id;
				var winner_id = answer.payload.winner_challonge_id;
				var scores = '1-0';
				process_match(msgRxn, guild_id, match_id, winner_id, scores);
				return msgRxn.message.channel.send(message_text.MATCH_WIN);
			}
			if(answer.status == constants.EMOJI_NO){
				// Send message to match channel asking if they want to report
				Console.log('MATCH REPORT REJECTED!!');
				Console.log(user);
				return msgRxn.message.channel.send(message_text.MATCH_REJECTED);
			}
		})
		.catch(err => Console.log(err));
	}
};

var process_match = (msgRxn, guild_id, match_id, winner_id, scores) => {
	challonge.updateMatch(guild_id, match_id, winner_id, scores)
	.then(() => {
		return challonge.isTourneyDone(guild_id);
	}).then((done) => {
		if (done == true) {
			return process_winner(msgRxn.message.guild);
		} else {
			return prep_round(msgRxn.message.guild, 1);
		}
	})
	.catch(err => Console.log(err));
};



module.exports = handler;
