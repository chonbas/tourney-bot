const db = require('../webservices/mongodb');
const constants = require('../util/constants');
// eslint-disable-next-line
const Console = require('../util/console');
const parseMessage = require('../util/parser');
const errhandler = require('./error_handler/handler');

var handlers = {};
handlers[constants.NO_TOURNEY] = require('./no_tourney/handler');
handlers[constants.INIT_TOURNEY] = require('./init_tourney/handler');
handlers[constants.SETUP_TOURNEY] = require('./setup_tourney/handler');
handlers[constants.RUN_TOURNEY] = require('./run_tourney/handler');
handlers[constants.CLOSE_TOURNEY] = require('./close_tourney/handler');



var manager = {};

var checkAndPassMsg = (team_id, initiator_id, msg, tournament_status, channel_type, question=null) =>{
	msg.parsed_msg = parseMessage(msg.content, tournament_status, channel_type, question);
	errhandler(team_id, initiator_id, msg, tournament_status, channel_type, question)
		.then((is_ok) => {
			if(is_ok){
				var handler = handlers[tournament_status];
				if (tournament_status === constants.INIT_TOURNEY){
					handler.handleMsg && handler.handleMsg(msg);
					return;
				}
				handler.handleMsg && handler.handleMsg(msg);
				return;
			}
		})
		.catch(err => Console.log(err));
};

manager.distributeMsg = (msg) => {
	if(msg.content.includes('PURGE')) {
		require('../webservices/discord').deleteAllTourneyChannels(msg.guild);
		return;
	}
	var tournament_status = null;
	var channel_type = null;
	var discord_id = null;
	var team_id = null;
	// retrieve tournament status
	db.getTournamentStatus(msg.guild.id).then((status) => {
		tournament_status = status;
		return db.getChannelType(msg.guild.id, msg.channel.id);
	//retrieve channel type
	}).then((channel_type_return) => {
		channel_type = channel_type_return;
		return db.getTournamentAdmin(msg.guild.id);
	}).then((initiator_id_return) => {
		initiator_id = initiator_id_return;
		return db.getParticipantTeamID(msg.guild.id, msg.author.id);
	}).then((team_id_return) => {
		team_id = team_id_return;
		//give info to parser and attach parsed info to msg object
		if (tournament_status === constants.INIT_TOURNEY){
			db.getNextStagedTourneyQuestion(msg.guild.id).then( (question) => {
				Console.log('question in manager: ' + question);
				checkAndPassMsg(team_id, initiator_id, msg, tournament_status, channel_type, question);
			}).catch(err => Console.log(err));
		} else {
			checkAndPassMsg(team_id, initiator_id, msg, tournament_status, channel_type);
		}
	}).catch(err => Console.log(err));
};

manager.distributeReaction = (msgReaction, user) => {
	db.getTournamentStatus(msgReaction.message.guild.id).then((status) => {
		var handler = handlers[status];
		//check that handler has function before acting
		handler.handleReaction && handler.handleReaction(msgReaction, user);
	});
};

module.exports = manager;
