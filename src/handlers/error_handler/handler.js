//require things up here
var Console = require('../../util/console');
var parser_constants = require('../../util/parse_constants');
const db = require('../../webservices/mongodb');
const challonge = require('../../webservices/challonge');
const constants = require('../../util/constants');


var handler = {};
//eslint-disable-next-line

var command_note = 'Remember, you can issue commands of the format +<COMMAND> if we seem to be miscommunicating.  Type +HELP for a list of commands.';

//MUST FINISH THIS HELP NOTE!!!
var help_note = 'Here is a list of commands you can use if I am misunderstanding you:\n+HELP: brings up this page\n+CREATE_TOURNEY: The first step to creating a new tournament\nINIT_TOURNEY:\n';

var no_tourney_err = 'There is currently no tourney in this guild.  You can create one by telling me +CREATE_TOURNEY\n';
var init_tourney_admin_err = 'The tourney is currently in the init stage.\n';
var init_tourney_err = 'The tourney is currently in the init stage. Please wait for the administrator, {0}, to finish deciding the tournament\'s parameters.\n';
var setup_tourney_err = 'The tourney in this guild is still in the set-up phase. You can join the tournament by telling me @bot+JOIN_TOURNEY\n';
var run_tourney_err = 'This tournament is currently in the matches phase. You can report matches by typing @bot+MATCH_REPORT_WIN or @bot+MATCH_REPORT_LOSE, or report a cheater with @bot+REPORT <User ID>\n';
var close_tourney_err = 'This tournament has completed and is in the process of shutting down\n'

var init_tourney_admin_err = 'You are still in the process of setting the tournament parameters.';


//INTENTION MESSAGES: (sent based on what the bot thinks the user is trying to do)
var match_report_err = 'You seem to be trying to report a match, which currently is not applicable at this time.\n';
var join_tourney_early = 'You seem to be trying to join a tournament.\n';
var join_tourney_late = 'You seem to be trying to join a tournament.  Unfortunately, this tournament is no longer accepting new players or teams.\n';
var create_tourney_err = 'You seem to by trying to create a tourney. Unfortunately, there is already a tourney present in this guild. You will have to switch to a new guild to create a new tournament.\n';
var drop_tourney_err = 'you are not currently a participant in this tournament.\n';
var report_err = 'You cannot report people at this time.\n';
var report_parsing_err = 'Please let me know who you are trying to report- type @username in the report message.\n';
var unidentified_err = 'I could not quite understand what you are trying to do.\n';

var init_nonsense_err = 'I didn\'t quite get that.]';


function current_state_msg(t_status){
	if(t_status === constants['NO_TOURNEY']){
		return no_tourney_err
	}
	if(t_status === constants['INIT_TOURNEY']){
		return init_tourney_err
	}
	if(t_status === constants['SETUP_TOURNEY']){
		return setup_tourney_err
	}
	if(t_status === constants['RUN_TOURNEY']){
		return run_tourney_err
	}
	if(t_status === constants['CLOSE_TOURNEY']){
		return close_tourney_err
	}
}

//does not do anything yet, error handle outside of init phase is WIP
function intended(msg, t_status){
	if(t_status != constants['RUN_TOURNEY'] && (msg.parsed_msg.parse===parser_constants['MATCH_REPORT_WIN'] || msg.parsed_msg.parse===parser_constants['MATCH_REPORT_WIN'] || msg.parsed_msg.parse===parser_constants['MATCH_REPORT_AMBIGUOUS'])){
		err_msg = match_report_err+current_state_msg(t_status)+command_note;
		msg.reply(err_msg)
		return false;
	}
	if(t_status != constants['NO_TOURNEY'] && msg.parsed_msg.parse===parser_constants['CREATE_TOURNEY']){
		err_msg = create_tourney_err+current_state_msg(t_status)+command_note;
		msg.reply(err_msg)
		return false;
	}
	//if(t_status != constants['END_TOURNEY']){
	//if(t_status != constants['DROP_TOURNEY']){
	if(t_status != constants['RUN_TOURNEY'] && msg.parsed_msg.parse===parser_constants['REPORT']){
		err_msg = report_err+current_state_msg(t_status)+command_note;
		msg.reply(err_msg)
		return false;
	}
	if(t_status === constants['RUN_TOURNEY'] && msg.parsed_msg.parse===parser_constants['REPORT'] && msg.parsed_msg.data_object.reported_user === null){
		err_msg = report_parsing_err+current_state_msg(t_status)+command_note;
		msg.reply(err_msg)
		return false;
	}
	return true;
}


//called if messager is admin

//handler must fufill with a data object that contains:
//OK or NOT OK
//Question

//participant cap must be between 3 and 9000

function update_msg(msg, cap=null){
	if(msg.parsed_msg.parse=='SINGLE_ELIM'){return 'Setting tourney type to single elimination.';}
	if(msg.parsed_msg.parse=='DOUBLE_ELIM'){return 'Setting tourney type to double elimination.';}
	if(msg.parsed_msg.parse=='SWISS'){return 'Setting tourney type to swiss.';}
	if(msg.parsed_msg.parse=='ROUND_ROBIN'){return 'Setting tourney type to round robin.';}
	if(msg.parsed_msg.parse=='NO_TEAMS'){return 'Turning teams off';}
	if(msg.parsed_msg.parse=='YES_TEAMS'){return 'Turning teams on';}
	if(msg.parsed_msg.parse=='NO_CAP'){return 'Setting participant cap to unliminited';}
	if(msg.parsed_msg.parse=='CAP'){return 'Setting participant cap to ' + cap + '.';}
}

function unidentified_err(msg){
	var err_msg = 'I did not understand that.  Could you please rephrase?';
	return err_msg;
}

function init_checker(msg, question=null){
	if(question === 'NAME' || msg.parsed_msg.parse === parser_constants['SINGLE_ELIM'] || msg.parsed_msg.parse === parser_constants['DOUBLE_ELIM'] ||
		msg.parsed_msg.parse === parser_constants['SWISS'] || msg.parsed_msg.parse === parser_constants['ROUND_ROBIN'] ||
		msg.parsed_msg.parse === parser_constants['NO_TEAMS'] || msg.parsed_msg.parse === parser_constants['YES_TEAMS'] ||
		msg.parsed_msg.parse === parser_constants['CAP'] || msg.parsed_msg.parse === parser_constants['NO_CAP'] || msg.parsed_msg.parse === parser_constants['YES']
		|| msg.parsed_msg.parse === parser_constants['NO']){
		Console.log('identified parse, returning true');
		return true;
	} else{
		Console.log('unidentified init');
		msg.reply('I did not understand that.  Could you please rephrase?');
		return false;
	}

}

//does not do anything yet, error handle outside of init phase is WIP
function admin_errors(msg, t_status, channel_type){
	var response;
	if(msg.parsed_msg.parse==parse_constants.HELP){
		response = help_note;
		return response;
	}
	if(t_status==constants.NO_TOURNEY && msg.parsed_msg.parse != CREATE_TOURNEY && msg.parsed_msg.parse != HELP){
		response = no_tourney_err;
		response = response + ' ' + intended(msg);
		return response;
	}

}



var errhandle = (msg, tournament_status, channel_type, question=null) => {
	return new Promise((fulfill, reject) => {
		//TODO: check states
		//TODO: give helpful error messages
		Console.log('ERR HANDLING');
		Console.log(msg);
		if(tournament_status == constants['INIT_TOURNEY']){
			fulfill(init_checker(msg, question));
		}
		else{
			//Console.log('FULFILLING TRUE');
			fulfill(intended(msg, tournament_status));
		}
	});
};
/*
handler.handleMsg = (msg, t_status) => {
	if(msg.parsed_msg.parse != parse_constants.MATC)
}*/


module.exports = errhandle;
