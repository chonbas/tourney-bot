//Parse message parses a given message,
//guesses what the user is trying to do, and returns
//an object that contains the following properties:
//parse: the guessed command (string)
//message: the full message (string)
//handler: the handler to deliver the message to (string)

//requires natural
var parse_constants = require('./parse_constants');

var Console = require('./console');

var parseMessage = (msg) => {

	var natural = require('natural'), tokenizer = new natural.WordTokenizer();

	var parse;
	var handler;
	var data_object = {};

	var words = tokenizer.tokenize(msg);
	for(var i = 0; i < words.length; i++){
		words[i] = natural.PorterStemmer.stem(words[i]);
	}
	if(words.includes('how') || words.includes('why') || words.includes('help') || words.includes('where') || words.includes('what')){
		parse = 'REQUEST_HELP';
		handler = 'all';
	} else if(words.includes('won') || words.includes('win') || words.includes('victory') ||
		words.includes('victorious') || words.includes('triumph')){
		parse = 'MATCH_REPORT_WIN';
		handler = 'match';
	} else if(words.includes('lost') || words.includes('lose') || words.includes('defeat')){
		parse = 'MATCH_REPORT_LOSE';
		handler = 'match';
	} else if(words.includes('finish') || words.includes('done')){
		parse = 'MATCH_REPORT_AMBIGUOUS';
		handler = 'match';
	} else if(words.includes('join') || words.includes('sign') || words.includes('add')){
		parse = 'JOIN_TOURNEY';
		handler = 'setup_tourney';
	} else if(words.includes('init') || words.includes('initialize') || words.includes('create') || words.includes('make')){
		parse = 'CREATE_TOURNEY';
		handler = 'no_tourney';
	} else if(words.includes('done') || words.includes('doneski')){
		parse = 'INIT_TOURNEY';
		handler = 'init_tourney';
		// data_object is the tournament object that will be passed to createTournament
		// tournamentType is camelCase because Challonge API requires it
		data_object.tournamentType = 'single elimination';
	} else if(words.includes('start') || words.includes('begin')){
		parse = 'START_TOURNEY';
		handler = 'setup_tourney';
	} else if(words.includes('end') || words.includes('destroy')){
		parse = 'END_TOURNEY';
		handler = 'all';
	} else if(words.includes('drop') || words.includes('quit') || ((words.includes('im') || words.includes('i\'m')) && words.includes('done'))){
		parse = 'DROP_TOURNEY';
		handler = 'all';
	} else if(words.includes('report') || words.includes('cheat') || words.includes('ban')){
		parse = 'REPORT';
		handler='match';
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


