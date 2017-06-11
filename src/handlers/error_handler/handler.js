//require things up here
var Console = require('../../util/console');
var parser_constants = require('../../util/parse_constants');
const constants = require('../../util/constants');


//eslint-disable-next-line

var command_note = 'Remember, you can issue commands of the format +<COMMAND> if we seem to be miscommunicating.  Type +HELP for a list of commands.';

//MUST FINISH THIS HELP NOTE!!!
var help_note = 'Here is a list of commands you can use if I am misunderstanding you:\n+HELP: brings up this page\n+CREATE_TOURNEY: The first step to creating a new tournament\nINIT_TOURNEY:\n';

var no_tourney_err = 'There is currently no tourney in this guild.  You can create one by telling me +CREATE_TOURNEY\n';
//var init_tourney_admin_err = 'The tourney is currently in the init stage. You are the tourney administrator- please go to the #tourney-init channel to set the parameters for the tourney.\n';
var init_tourney_err = 'The tourney is currently in the init stage. Please wait for the tourney creator to finish deciding the tournament\'s parameters.\n \n If you created the tournament, go to the tourney-init channel to set the tournament\'s parameters';
var setup_tourney_err = 'The tourney in this guild is still in the set-up phase. You can join the tournament by telling me @bot+JOIN_TOURNEY\n';
var run_tourney_err = 'This tournament is currently in the matches phase. You can report matches by typing @bot+MATCH_REPORT_WIN or @bot+MATCH_REPORT_LOSE, or report a cheater with @bot+REPORT <User ID>\n';
var close_tourney_err = 'This tournament has completed and is in the process of shutting down\n';

//var init_tourney_admin_err = 'You are still in the process of setting the tournament parameters.';


//INTENTION MESSAGES: (sent based on what the bot thinks the user is trying to do)
var match_report_err = 'You seem to be trying to report a match, which currently is not applicable at this time.\n';
var join_tourney_err = 'You cannot joint a tournament in this guild at this time.\n';
//var join_tourney_late = 'You seem to be trying to join a tournament.  Unfortunately, this tournament is no longer accepting new players or teams.\n';
var create_tourney_err = 'You seem to by trying to create a tourney. Unfortunately, there is already a tourney present in this guild. You will have to switch to a new guild to create a new tournament.\n';
var drop_tourney_err = 'you are not currently a participant in this tournament.\n';
var report_err = 'You cannot report people at this time.\n';
var unidentified_err = 'I could not quite understand what you are trying to do.\n';
var end_tourney_err = 'It seems that you are trying to end/destroy a tournament.\n';
var end_tourney_non_admin_err = 'It seems that you are trying to end/destroy a tournament. Like the one ring, this tournament can only be destroyed by that which it was created from (in this case, the tourney creator).\n';

var kilL_tourney_err = 'It seems you are trying to end a tournament';

var report_parsing_err = 'Please let me know who you are trying to report- type @username in the report message.\n';
var join_parsing_err = 'I did not get the name of the team you are trying to create and/or join. Remember to your team name in quotes.';

var init_nonsense_err = 'I didn\'t quite get that.';


function current_state_msg(t_status, initiator_id, msg){
	if(t_status === constants['NO_TOURNEY']){
		return no_tourney_err;
	}
	if(t_status === constants['INIT_TOURNEY']){
		if(initiator_id === msg.author.id){
			return init_tourney_err;
		}
		else{
			return init_tourney_err;
		}
	}
	if(t_status === constants['SETUP_TOURNEY']){
		return setup_tourney_err;
	}
	if(t_status === constants['RUN_TOURNEY']){
		return run_tourney_err;
	}
	if(t_status === constants['CLOSE_TOURNEY']){
		return close_tourney_err;
	}
}

//only join teams once?
//report already reported user
//update help note

//MUST HANDLE JOINING WITHOUT ARGUMENT***
//TOURNAMENT CAP UNDER 3 OR OVER 256***
//INIT WHEN NOT INITIATOR***
//PARSER: CREATE TO JOIN TEAMS, ALSO, UPDATE CREATE TOURNEY PARSER***
//JOIN TEAM YOU ARE ALREADY ON
//ONE V ONE BUG!!!!!!!!
//does not do anything yet, error handle outside of init phase is WIP
function intended(initiator_id, msg, t_status){
	if(t_status != constants['RUN_TOURNEY'] && (msg.parsed_msg.parse===parser_constants['MATCH_REPORT_WIN'] || msg.parsed_msg.parse===parser_constants['MATCH_REPORT_WIN'] || msg.parsed_msg.parse===parser_constants['MATCH_REPORT_AMBIGUOUS'])){
		var err_msg = match_report_err+current_state_msg(t_status, initiator_id, msg)+command_note;
		Console.log('reporting a win outside run');
		msg.reply(err_msg);
		return false;
	}
	if(t_status != constants['NO_TOURNEY'] && msg.parsed_msg.parse===parser_constants['CREATE_TOURNEY']){
		err_msg = create_tourney_err+current_state_msg(t_status, initiator_id, msg)+command_note;
		msg.reply(err_msg);
		return false;
	}
	if(t_status === constants['NO_TOURNEY'] && msg.parsed_msg.parse === parser_constants['END_TOURNEY']){
		err_msg = end_tourney_err+current_state_msg(t_status, initiator_id, msg)+command_note;
		msg.reply(err_msg);
		return false;
	}
	if(msg.parsed_msg.parse === parser_constants['END_TOURNEY'] && initiator_id != msg.author.id){
		err_msg = end_tourney_non_admin_err+current_state_msg(t_status, initiator_id, msg)+command_note;
		msg.reply(err_msg);
		return false;
	}
	if(t_status != constants['SETUP_TOURNEY'] && msg.parsed_msg.parse === parser_constants['JOIN_TOURNEY']){
		err_msg = join_tourney_err+current_state_msg(t_status, initiator_id, msg)+command_note;
		msg.reply(err_msg);
		return false;
	}
	if(t_status != constants['RUN_TOURNEY'] && msg.parsed_msg.parse===parser_constants['REPORT']){
		err_msg = report_err+current_state_msg(t_status, initiator_id, msg)+command_note;
		msg.reply(err_msg);
		return false;
	}
	if(t_status === constants['RUN_TOURNEY'] && msg.parsed_msg.parse===parser_constants['REPORT'] && msg.parsed_msg.data_object.reported_user === null){
		err_msg = report_parsing_err;
		msg.reply(err_msg);
		return false;
	}
	if(t_status === constants['SETUP_TOURNEY'] && msg.parsed_msg.parse===parser_constants['JOIN_TOURNEY'] && msg.parsed_msg.data_object.team_name === null){
		err_msg = join_parsing_err;
		msg.reply(err_msg);
		return false;
	}
	return true;
}


//called if messager is admin

//handler must fufill with a data object that contains:
//OK or NOT OK
//Question

//participant cap must be between 3 and 9000
/*
function update_msg(msg, cap=null){
	if(msg.parsed_msg.parse=='SINGLE_ELIM'){return 'Setting tourney type to single elimination.';}
	if(msg.parsed_msg.parse=='DOUBLE_ELIM'){return 'Setting tourney type to double elimination.';}
	if(msg.parsed_msg.parse=='SWISS'){return 'Setting tourney type to swiss.';}
	if(msg.parsed_msg.parse=='ROUND_ROBIN'){return 'Setting tourney type to round robin.';}
	if(msg.parsed_msg.parse=='NO_TEAMS'){return 'Turning teams off';}
	if(msg.parsed_msg.parse=='YES_TEAMS'){return 'Turning teams on';}
	if(msg.parsed_msg.parse=='NO_CAP'){return 'Setting participant cap to unliminited';}
	if(msg.parsed_msg.parse=='CAP'){return 'Setting participant cap to ' + cap + '.';}
}*/

function init_checker(initiator_id, msg, question=null){
	/*if(initiator_id != msg.author.id){
		Console.log('THEY DO NOT MATCH!!')
		msg.reply(init_tourney_err);
		return false;
	}*/
	if(msg.parsed_msg.parse === parser_constants['CAP'] && (msg.parsed_msg.data_object.signup_cap < 4 || msg.parsed_msg.data_object.signup_cap > 255)){
		msg.reply('The participant cap must be between 4 and 255. ');
		return false;
	}
	if(question === 'NAME' || msg.parsed_msg.parse === parser_constants['SINGLE_ELIM'] || msg.parsed_msg.parse === parser_constants['DOUBLE_ELIM'] ||
		msg.parsed_msg.parse === parser_constants['SWISS'] || msg.parsed_msg.parse === parser_constants['ROUND_ROBIN'] ||
		msg.parsed_msg.parse === parser_constants['NO_TEAMS'] || msg.parsed_msg.parse === parser_constants['YES_TEAMS'] ||
		msg.parsed_msg.parse === parser_constants['CAP'] || msg.parsed_msg.parse === parser_constants['NO_CAP'] || msg.parsed_msg.parse === parser_constants['YES']
		|| msg.parsed_msg.parse === parser_constants['NO'] || msg.parsed_msg.parse === parser_constants['DEFINE_NAME']){
		Console.log('identified parse, returning true');
		return true;
	} else{
		Console.log('unidentified init');
		msg.reply('I did not understand that.  Could you please rephrase?');
		return false;
	}

}



var errhandle = (initiator_id, msg, tournament_status, channel_type, question=null) => {
	return new Promise((fulfill, reject) => {
		//TODO: check states
		//TODO: give helpful error messages
		Console.log('ERR HANDLING');
		Console.log(msg);
		if(tournament_status == constants['INIT_TOURNEY'] && channel_type == constants['INIT_CHANNEL']){
			fulfill(init_checker(initiator_id, msg, question));
		}
		else{
			//Console.log('FULFILLING TRUE');
			fulfill(intended(initiator_id, msg, tournament_status));
		}
	});
};
/*
handler.handleMsg = (msg, t_status) => {
	if(msg.parsed_msg.parse != parse_constants.MATC)
}*/


module.exports = errhandle;
