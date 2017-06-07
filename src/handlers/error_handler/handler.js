//require things up here
var Console = require('../../util/console');
<<<<<<< HEAD
var parser_constants = require('../../util/parse_constants');
const db = require('../../webservices/mongodb');
const challonge = require('../../webservices/challonge');
const constants = require('../../util/constants');


var handler = {};
//eslint-disable-next-line

var command_note = "Remember, you can issue commands of the format +<COMMAND> if we seem to be miscommunicating.  Type +HELP for a list of commands.";

//MUST FINISH THIS HELP NOTE!!!
var help_note = "Here is a list of commands you can use if I am misunderstanding you:\n+HELP: brings up this page\n+CREATE_TOURNEY: The first step to creating a new tournament\nINIT_TOURNEY:";

var no_tourney_err = "There is currenlty no tourney in this guild.  You can create one by telling me +CREATE_TOURNEY";
var init_tourney_admin_err = "The tourney is currently in the init stage.";
var init_tourney_err = "The tourney is currently in the init stage. Please wait for the administrator, {0}, to finish deciding the tournament's parameters.".format(admin);
var setup_tourney_err = "The tourney in this guild is still in the set-up phase. You can join the tournament by telling me @bot+JOIN_TOURNEY";
var run_tourney = "This tournament is currently in the matches phase. You can report matches by typing @bot+MATCH_REPORT_WIN or @bot+MATCH_REPORT_LOSE, or report a cheater with @bot+REPORT <User ID>";


var init_tourney_admin_err = "You are still in the process of setting the tournament parameters.";


//INTENTION MESSAGES: (sent based on what the bot thinks the user is trying to do)
var match_report_err = "You seem to be trying to report a match, which currently is not applicable at this time.";
var join_tourney_early = "You seem to be trying to join a tournament.";
var join_tourney_late = "You seem to be trying to join a tournament.  Unfortunately, this tournament is no longer accepting new players or teams.";
var create_tourney_err = "You seem to by trying to create a tourney. Unfortunately, there is already a tourney present in this guild. You will have to switch to a new guild to create a new tournament.";
var drop_tourney_err = "you are not currently a participant in this tournament.";
var report_err = "You cannot report people at this time.";
var unidentified_err = "I could not quite understand what you are trying to do.";

var init_nonsense_err = "I didn't quite get that.";



//called if messager is admin

//handler must fufill with a data object that contains:
//OK or NOT OK
//Question

function update_msg(msg, cap=null){
	if(msg.parsed_msg.parse=='SINGLE_ELIM'){return "Setting tourney type to single elimination.";}
	if(msg.parsed_msg.parse=='DOUBLE_ELIM'){return "Setting tourney type to double elimination.";}
	if(msg.parsed_msg.parse=='SWISS'){return "Setting tourney type to swiss.";}
	if(msg.parsed_msg.parse=='ROUND_ROBIN'){return "Setting tourney type to round robin.";}
	if(msg.parsed_msg.parse=='NO_TEAMS'){return "Turning teams off";}
	if(msg.parsed_msg.parse=='YES_TEAMS'){return "Turning teams on";}
	if(msg.parsed_msg.parse=='NO_CAP'){return "Setting participant cap to unliminited";}
	if(msg.parsed_msg.parse=='CAP'){return "Setting participant cap to " + cap + ".";}
}

function unidentified_err(msg, question=null){
	if(question=='TEAMS'){
		return 'I did not understand that.  Could you please rephrase?'
	}
}

function init_checker(msg, question=null){
	if(question == 'NAME'){
		return [true, question];
	} else if(question == 'T_TYPE'){
		if(msg.parsed_msg.parse == 'SINGLE_ELIM' || msg.parsed_msg.parse == 'DOUBLE_ELIM' || msg.parsed_msg.parse == 'SWISS' || msg.parsed_msg.parse == 'ROUND_ROBIN'){
			return [true, question];
		}
		else if(msg.parsed_msg.data_object.answered != null){
			return [true, msg.parsed_msg.data_object.answered];
		}
		else{
			return [false, question];
		}
	} else if(question == 'TEAMS'){
		if(msg.parsed_msg.parse == 'NO_TEAMS' || msg.parsed_msg.parse == 'YES_TEAMS'){
			return [true, question]
		}
		else if(msg.parsed_msg.data_object.answered != null){
			return [true, msg.parsed_msg.data_object.answered];
		}
		else{
			return [false, question];
		}
	} else if(question == 'STARTUP_CAP'){
		if(msg.parsed_msg.parse == 'CAP' || msg.parsed_msg.parse == 'NO_CAP'){
			return [true, question]
		}
		else if(msg.parsed_msg.data_object.answered != null){
			return [true, msg.parsed_msg.data_object.answered];
		}
		else{
			return [false, question];
		}
	}

}


function intended(msg, t_status){
	if(msg.parsed_msg.parse==MATCH_REPORT_WIN || msg.parsed_msg.parse==MATCH_REPORT_LOSE){
		return match_report_err
	}
	if(msg.parsed_msg.parse==JOIN_TOURNEY || msg.parsed_msg.parse==MATCH_REPORT_LOSE){
		return match_report_err
	}
}

function admin_errors(msg, t_status, channel_type){
	var response;
	if(msg.parsed_msg.parse==parse_constants.HELP){
		response = help_note;
		return response;
	}
	if(t_status=='NO_TOURNEY' && msg.parsed_msg.parse != CREATE_TOURNEY && msg.parsed_msg.parse != HELP){
		response = no_tourney_err;
		response = response + " " + intended(msg);
		return response;
	}]

}



var errhandle = (msg, tournament_status, channel_type, question=null) => {
	return new Promise((fulfill, reject) => {
		//TODO: check states
		//TODO: give helpful error messages
		init_err = init_checker(msg, question);
		if(init_err[1] != null && init_err[1] != question){
			msg.reply(update_msg(msg, msg.parsed_msg.data_object.number));
		}
		fulfill(init_err[0]);
	});
}

handler.handleMsg = (msg, t_status) => {
	if(msg.parsed_msg.parse != parse_constants.MATC)

}


module.exports = errhandle;
