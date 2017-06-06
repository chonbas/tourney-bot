//Parse message parses a given message,
//guesses what the user is trying to do, and returns
//an object that contains the following properties:
//parse: the guessed command (string)
//message: the full message (string)
//handler: the handler to deliver the message to (string)

//requires natural

var parse_constants = require('./parse_constants');

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

	if(msg[0] == '+REQUEST_HELP'){
		parse = 'REQUEST_HELP';
		handler = 'all';
	} else if(msg[0] == '+MATCH_REPORT_WIN'){
		parse = 'MATCH_REPORT_WIN';
		handler = 'match';
	} else if(msg[0] == '+MATCH_REPORT_LOSE'){
		parse = 'MATCH_REPORT_LOSE';
		handler = 'match';
	} else if(msg[0] == '+MATCH_REPORT_AMBIGUOUS'){
		parse = 'MATCH_REPORT_AMBIGUOUS';
		handler = 'match';
	} else if(msg[0] == '+JOIN_TOURNEY' && msg[1].match(/\".+\"/i) != null){
		data_object.team_name = msg[1].match(/\".+\"/i)[0];
		parse = 'JOIN_TOURNEY';
		handler = 'setup_tourney';
		Console.log('team name = ' + data_object.team_name);
	} else if(msg[0] == '+CREATE_TOURNEY'){
		parse = 'CREATE_TOURNEY';
		handler = 'no_tourney';
	} else if(msg[0] == '+INIT_TOURNEY' && msg[1].match(/\"[.+]\"/i) != null){
		parse = 'INIT_TOURNEY';
		handler = 'init_tourney';
		data_object.tourney_name = msg[1].match(/\"[.+]\"/i)[0];
		Console.log('tourney name = ' + data_object.tourney_name);

		// data_object is the tournament object that will be passed to createTournament
		// tournamentType is camelCase because Challonge API requires it
		data_object.tournamentType = 'single elimination';
	} else if(msg[0] == '+START_TOURNEY'){
		parse = 'START_TOURNEY';
		handler = 'setup_tourney';
	} else if(msg[0] == '+END_TOURNEY'){
		parse = 'END_TOURNEY';
		handler = 'close_tourney';
	} else if(msg[0] == '+DROP_TOURNEY'){ //when a user wants to drop from the tourney
		parse = 'DROP_TOURNEY';
		handler = 'all';
	} else if(msg[0] == '+REPORT' && msg[1].match(/<@(\d|\!)+>/i) != null){ //To report some one, do REPORT
		parse = 'REPORT';
		data_object.reported_user = msg[1].match(/<@(\d|\!)+>/i)[0];
		Console.log('reported user = ' + data_object.reported_user);
		handler='match';
	} else if(msg[0] == '+VOTE_GUILTY'){ //keeping these in just in case
		parse = 'VOTE_GUILTY';
		handler='dispute';
	} else if(msg[0] == '+VOTE_INNOCENT'){
		parse = 'VOTE_INNOCENT';
		handler='dispute';
	} else if(msg[0] == '+CHANGE_SETTINGS'){ //I realize this isn't useful yet
		parse = 'CHANGE_SETTINGS';
		handler='all';
	} else if(msg[0] == '+YES'){
		parse = 'YES';
		handler='all';
	} else if(msg[0] == '+NO'){
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


var parseMessage = (msg, tourney_state, channel_type) => {
	Console.log(msg);

	msg = processMessage(msg);
	if(msg[0]=='+' || (msg[0]==' ' && msg[1]=='+')){
		return parseCommand(msg);
	}

	var natural = require('natural'), tokenizer = new natural.WordTokenizer();

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
		parse = 'REQUEST_HELP';
		handler = 'all';
	} else if(words.includes('won') || words.includes('win') || words.includes('victory') ||
		words.includes('victorious') || words.includes('triumph') || words.includes('beat')){
		parse = 'MATCH_REPORT_WIN';
		handler = 'match';
	} else if(words.includes('lost') || words.includes('lose') || words.includes('defeat')){
		parse = 'MATCH_REPORT_LOSE';
		handler = 'match';
	} else if(words.includes('finish') || words.includes('done')){
		parse = 'MATCH_REPORT_AMBIGUOUS';
		handler = 'match';
	} else if(words.includes('join') || words.includes('sign') || words.includes('add') || words.includes('enter')){ //will return null if "team name" not found
		parse = 'JOIN_TOURNEY';
		handler = 'setup_tourney';
		for(var i = 0; i < words.length; i++){
			if(msg.match(/\".+\"/i) != null){
				data_object.team_name = msg.match(/\".+\"/i)[0];
				break;
			}
		}
		Console.log('team name = ' + data_object.team_name);
	} else if(words.includes('init') || words.includes('initialize') || words.includes('create') || words.includes('make')){
		parse = 'CREATE_TOURNEY';
		handler = 'no_tourney';
	} else if(words.includes('name')){
		parse = 'INIT_TOURNEY';
		handler = 'init_tourney';
		// for(var i = 0; i < words.length; i++){
		// 	if(msg.match(/\".+\"/i) != null){
		// 		data_object.tourney_name = msg.match(/\".+\"/i)[0];
		// 		break;
		// 	}
		// }
		// Console.log("tourney name = " + data_object.tourney_name);
		// data_object is the tournament object that will be passed to createTournament
		// tournamentType is camelCase because Challonge API requires it
		data_object.tournamentType = 'single elimination';
	} else if(words.includes('start') || words.includes('begin')){
		parse = 'START_TOURNEY';
		handler = 'setup_tourney';
	} else if(words.includes('end') || words.includes('destroy')){
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
		for(var i = 0; i < words.length; i++){
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
	} else if(words.includes('set') || words.includes('setting') || words.includes('adjust') ||
		words.includes('change')){
		parse = 'CHANGE_SETTINGS';
		handler='all';
	} else if(words.includes('yes') || words.includes('y') || words.includes('affirmative')){
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
