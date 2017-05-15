var Console = require('../../util/console');
var client = require('../../webservices/challonge');

// eslint-disable-next-line

//Generates random strings for the URL
function randomString(length, chars) {
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	return result;
}

function processName(msg) {
	Console.log('REGEX STUFF');
	Console.log(msg);
	var name = msg.replace(/<@\d+>/i,' ');
	Console.log(name);
	return name;
}

var makeChallongeTourney = (msg) => {
	Console.log(msg.content);
	var t_name = processName(msg.content);
	var t_url = randomString(9, '0123456789abcdefghijklmnopqrstuvwxyz');
	return new Promise((fulfill, reject) => {
		// TODO: make channels for tournament
		client.tournaments.create({
			tournament: {
				name: t_name,
				url: t_url,
				tournamentType: 'single elimination',
			},
			callback: (err, data) => {
				Console.log('BEGINNING OF CALLBACK');
				if(err){
					Console.log(err);
					reject();
				}
				else{
					Console.log(err,data);
					Console.log('tourney url is: ' + t_url);
					//Console.log('data 1 returned is: ' + data[1]);
					//var challonge_id = 'GARBAGE';
					fulfill(t_url);
				}
			}
		});
	});
};

module.exports = makeChallongeTourney;
