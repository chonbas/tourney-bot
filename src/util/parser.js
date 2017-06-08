//Parse message parses a given message,
//guesses what the user is trying to do, and returns
//an object that contains the following properties:
//parse: the guessed command (string)
//message: the full message (string)
//handler: the handler to deliver the message to (string)

//requires natural
//manager

var parse_constants = require('./parse_constants');
var constants = require('./constants');

var Console = require('./console');

function processMessage(msg) {
	var name = msg.replace(/<@(\d|\!)+>/i,'');
	return name;
}

//the msg is considered a command if it is preceded by a '+'
//the space is automatically added to the me
function parseCommand(msg){
	var parse;
	var handler;
	var data_object = {};

	msg = msg.match(/(?:[^\s"]+|"[^"]*")+/g);

	if(msg[0] === '+HELP'){
		parse = 'HELP';
		handler = 'all';
	} else if(msg[0] === '+MATCH_REPORT_WIN'){
		parse = 'MATCH_REPORT_WIN';
		handler = 'match';
	} else if(msg[0] === '+MATCH_REPORT_LOSE'){
		parse = 'MATCH_REPORT_LOSE';
		handler = 'match';
	} else if(msg[0] === '+MATCH_REPORT_AMBIGUOUS'){
		parse = 'MATCH_REPORT_AMBIGUOUS';
		handler = 'match';
	} else if(msg[0] === '+JOIN_TOURNEY' && msg[1].match(/\".+\"/i) != null){
		data_object.team_name = msg[1].match(/\".+\"/i)[0];
		parse = 'JOIN_TOURNEY';
		handler = 'setup_tourney';
		Console.log('team name = ' + data_object.team_name);
	} else if(msg[0] === '+CREATE_TOURNEY'){
		parse = 'CREATE_TOURNEY';
		handler = 'no_tourney';
	} else if(msg[0] === '+INIT_TOURNEY' && msg[1].match(/\"[.+]\"/i) != null){
		parse = 'INIT_TOURNEY';
		handler = 'init_tourney';
		data_object.name = msg[1].match(/\"[.+]\"/i)[0];
		Console.log('tourney name = ' + data_object.tourney_name);
		data_object.tournament_type = 'single elimination';
	} else if(msg[0] === '+START_TOURNEY'){
		parse = 'START_TOURNEY';
		handler = 'setup_tourney';
	} else if(msg[0] === '+END_TOURNEY'){
		parse = 'END_TOURNEY';
		handler = 'close_tourney';
	} else if(msg[0] === '+DROP_TOURNEY'){ //when a user wants to drop from the tourney
		parse = 'DROP_TOURNEY';
		handler = 'all';
	} else if(msg[0] === '+REPORT' && msg[1].match(/<@(\d|\!)+>/i) != null){ //To report some one, do REPORT
		parse = 'REPORT';
		data_object.reported_user = msg[1].match(/<@(\d|\!)+>/i)[0];
		Console.log('reported user = ' + data_object.reported_user);
		handler='match';
	} else if(msg[0] === '+VOTE_GUILTY'){ //keeping these in just in case
		parse = 'VOTE_GUILTY';
		handler='dispute';
	} else if(msg[0] === '+VOTE_INNOCENT'){
		parse = 'VOTE_INNOCENT';
		handler='dispute';
	} else if(msg[0] === '+CHANGE_SETTINGS'){ //I realize this isn't useful yet
		parse = 'CHANGE_SETTINGS';
		handler='all';
	} else if(msg[0] === '+YES'){
		parse = 'YES';
		handler='all';
	} else if(msg[0] === '+NO'){
		parse = 'NO';
		handler='all';
	} else{
		parse = 'UNIDENTIFIED';
		handler='all';
	}
	Console.log(parse);
	return {parse: parse_constants[parse], message: msg, handler: handler, data_object: data_object};
}

//takes in an array of words, looks for the first user ID. (ex. for reporting)
function findUserID(msg){
	for(var i = 0; i < msg.length; i++){
		if(msg[i].match(/<@(\d|\!)+>/i) != null){
			return msg[i].match(/<@(\d|\!)+>/i)[0];
		}
	}
	return null;
}



var parseMessageInit = (msg, tourney_state, channel_type, question=null) => {
	Console.log(msg);

	msg = processMessage(msg);
	var natural = require('natural'); //, tokenizer = new natural.WordTokenizer(); < - declared but never used?

	var parse;
	var handler;
	var data_object = {};

	var words = msg.match(/(?:[^\s"]+|"[^"]*")+/g);
	for(var i = 0; i < words.length; i++){
		if(!words[i].search('\"') && !words[i].search('\'')){
			words[i] = natural.PorterStemmer.stem(words[i]);
		}
	}

	//check if response includes a number
	var numeric_response = false;
	for(i = 0; i < words.length; i++){
		Console.log(msg.match(/\d+/i));
		if(msg.match(/\d+/i) != null){
			data_object.signup_cap = parseInt(msg.match(/\d+/i)[0]);
			numeric_response = true;
			break;
		}
	}
	Console.log('Question = ' + question);

	//if the bot asked about the tourney name, any response given will be interpreted as the tourney name.
	if(question==='NAME'){
		for(i = 0; i < words.length; i++){
			if(msg.match(/(\"|\').+(\"|\')/i) != null){
				data_object.tourney_name = msg.match(/(\"|\').+(\"|\')/i)[0];
				break;
			}
		}
		//if user didn't put anything in quotes, it treats the entire message as the tourney name
		if(!data_object.tourney_name){
			data_object.tourney_name=words.join(' ');
		}
		Console.log('data object');
		Console.log(data_object);
		parse='DEFINE_NAME';
		handler='init_tourney';
	} else if(words.includes('how') || words.includes('why') || words.includes('help') || words.includes('where') || words.includes('what')){
		parse = 'HELP';
		handler = 'init_tourney';
	} else if(words.includes('1v1') || (words.includes('single') && words.includes('player')) || ((words.includes('one') || words.includes('1'))  && (words.includes('verses') || words.includes('vs')))){
 		if(words.includes('no') || words.includes('unneccessary') || words.includes('nope') || words.includes('none')  || words.includes('not')){
			parse = 'NO_TEAMS';
			handler = 'init_tourney';
			data_object.teams = false;
		} else{
			parse = 'YES_TEAMS';
			handler='init_tourney';
			data_object.teams = true;
		}
	} else if(question==="TEAMS" && (words.includes('yes') || words.includes('y') || words.includes('affirmative') || words.includes('totally') || words.includes('sure'))){
		parse = 'YES_TEAMS';
		handler = 'init_tourney';
		data_object.teams = false; // question asked is 'is this 1v1'
	} else if(question==="TEAMS" && (words.includes('no') || words.includes('n') || words.includes('negative') || words.includes('nope'))){
		parse = 'NO_TEAMS';
		handler = 'init_tourney';
		data_object.teams = true;
	} else if(words.includes('single') || words.includes('single-elim') || words.includes('single-elimination')){
		parse = 'SINGLE_ELIM';
		handler = 'init_tourney';
		data_object.tournament_type = 'single elimination';
	} else if(words.includes('double') || words.includes('double-elim') || words.includes('double-elimination')){
		parse = 'DOUBLE_ELIM';
		handler = 'init_tourney';
		data_object.tournament_type = 'double elimination';
	} else if(words.includes('swiss')){
		parse = 'SWISS';
		handler = 'init_tourney';
		data_object.tournament_type = 'swiss';
	} else if(words.includes('round') || words.includes('robin') || words.includes('roundrobin') || words.includes('round-robin')){
		parse = 'ROUND_ROBIN';
		handler = 'init_tourney';
		data_object.tournament_type = 'round robin';
 	} else if(words.includes('cap') || words.includes('max')){
 		if(words.includes('no') || words.includes('unneccessary') || words.includes('nope') || words.includes('none')  || words.includes('not')){
			parse = 'NO_CAP';
			handler = 'init_tourney';
			data_object.answered = 'STARTUP_CAP';
			data_object.signup_cap = 0;
		} else{
			parse = 'CAP';
			handler='match';
			data_object.answered = 'STARTUP_CAP';
			for(i = 0; i < words.length; i++){
				if(msg.match(/\d+/i) != null){
					data_object.singup_cap = msg.match(/\d+/i)[0];
					break;
				}
			}
		}
	} else if(question==='STARTUP_CAP' && numeric_response === true){
 		parse = 'CAP';
 		handler = 'init_tourney';

	} else if(words.includes('team')){
 		if(words.includes('no') || words.includes('unneccessary') || words.includes('nope') || words.includes('none')  || words.includes('none')){
			parse = 'NO_TEAMS';
			handler = 'init_tourney';
			data_object.teams = false;
		} else{
			parse = 'YES_TEAMS';
			handler='init_tourney';
			data_object.teams = true;
		}
	} else if(words.includes('name')){ //if the user types "name" in this phase, the bot looks for quotes for what to change the name to.
		data_object.tourney_name='null';
		for(i = 0; i < words.length; i++){
			if(msg.match(/(\"|\').+(\"|\')/i) != null){
				data_object.tourney_name = msg.match(/(\"|\').+(\"|\')/i)[0];
				break;
			}
		}
		parse='DEFINE_NAME';
		handler = 'init_tourney';
		data_object.answered = null;
	} else if(words.includes('yes') || words.includes('y') || words.includes('sure')){
		parse = 'YES';
		handler = 'init_tourney';
		data_object.answered = null;
	} else if(words.includes('no') || words.includes('n') || words.includes('negative')){
		parse = 'NO';
		handler = 'init_tourney';
		data_object.answered = null;
	} else{
		parse = 'UNIDENTIFIED';
		handler = 'init_tourney';
		data_object.answered = null;
	}
	Console.log('INIT PARSER: ' + parse);

	return {parse: parse_constants[parse], message: msg, handler: handler, data_object: data_object};

};



var parseMessage = (msg, tourney_state, channel_type, question=null) => {
	Console.log(msg);
	Console.log(question);

	msg = processMessage(msg);

	if(msg[0]==='+' || (msg[0]===' ' && msg[1]==='+')){
		return parseCommand(msg);
	}

	var natural = require('natural'); //, tokenizer = new natural.WordTokenizer();

	var parse;
	var handler;
	var data_object = {};

	var words = msg.match(/(?:[^\s"]+|"[^"]*")+/g);
	for(var i = 0; i < words.length; i++){
		if(!words[i].search('\"') && !words[i].search('\'')){
			words[i] = natural.PorterStemmer.stem(words[i]);
		}
	}
	if(words.includes('how') || words.includes('why') || words.includes('help') || words.includes('where') || words.includes('what')){
		parse = 'HELP';
		handler = 'all';
	} else if(words.includes('won') || words.includes('win') || words.includes('victor') ||
		words.includes('victorious') || words.includes('triumph') || words.includes('beat')){
		if(words.includes('not') || words.includes('they') || words.includes('he') || words.includes('she') || words.includes('unable')){
			parse = 'MATCH_REPORT_LOSE';
			handler = 'match';
		}
		else{
			parse = 'MATCH_REPORT_WIN';
			handler = 'match';
		}
	} else if(words.includes('lost') || words.includes('lose') || words.includes('defeat')){
		if(words.includes('not') || words.includes('they') || words.includes('he') || words.includes('she') || words.includes('unable')){
			parse = 'MATCH_REPORT_WIN';
			handler = 'match';
		}
		else{
			parse = 'MATCH_REPORT_LOSE';
			handler = 'match';
		}
	} else if(words.includes('finish') || words.includes('done')){
		parse = 'MATCH_REPORT_AMBIGUOUS';
		handler = 'match';
	} else if(words.includes('join') || words.includes('sign') || words.includes('add') || words.includes('enter')){ //will return null if "team name" not found
		parse = 'JOIN_TOURNEY';
		handler = 'setup_tourney';
		for(i = 0; i < words.length; i++){
			if(msg.match(/(\"|\').+(\"|\')/i) != null){
				data_object.team_name = msg.match(/\".+\"/i)[0];
				break;
			}
		}
		Console.log('team name = ' + data_object.team_name);
	} else if(words.includes('init') || words.includes('initialize') || words.includes('create') || words.includes('make')){
		parse = 'CREATE_TOURNEY';
		handler = 'no_tourney';
	} else if(words.includes('start') || words.includes('begin')){
		parse = 'START_TOURNEY';
		handler = 'setup_tourney';
	} else if(words.includes('end') || words.includes('destroy') || words.includes('close') || words.includes('kill') || words.includes('stop')){
		parse = 'END_TOURNEY';
		handler = 'close_tourney';
	} else if(words.includes('drop') || words.includes('quit') || ((words.includes('im') || words.includes('i\'m')) && words.includes('done'))){
		parse = 'DROP_TOURNEY';
		handler = 'all';
	} else if(words.includes('report') || words.includes('cheat') || words.includes('ban')){
		data_object.reported_user = findUserID(msg);
		Console.log('reported user = ' + data_object.reported_user);
		parse = 'REPORT';
		handler='match';
		for(i = 0; i < words.length; i++){
			if(msg.match(/<@(\d|\!)+>/i) != null){
				data_object.reported_user = msg.match(/<@(\d|\!)+>/i)[0];
				break;
			}
		}
		Console.log('reported user = ' + data_object.reported_user);
	} else if(words.includes('guilty')){ //HOW DOES JURY WORK??
		parse = 'VOTE_GUILTY';
		handler='dispute';
	} else if(words.includes('innocent') || words.includes('aquit')){ //HOW DOES JURY WORK??
		parse = 'VOTE_INNOCENT';
		handler='dispute';
	} else if(tourney_state === constants['INIT_TOURNEY']){
		return parseMessageInit(msg, tourney_state, channel_type, question);
	}else if(words.includes('yes') || words.includes('y') || words.includes('affirmative')){
		parse = 'YES';
		handler='all';
	} else if(words.includes('no') || words.includes('n') || words.includes('nope') || words.includes('negative')){
		parse = 'NO';
		handler='all';
	} else{
		parse = 'UNIDENTIFIED';
		handler='all';
	}
	Console.log(parse);

	return {parse: parse_constants[parse], message: msg, handler: handler, data_object: data_object};

};

module.exports = parseMessage;
