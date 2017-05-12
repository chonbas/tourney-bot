const client = require('../../webservices/challonge.js');
const Console = require('../../util/console');

function randomString(length, chars) {
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	return result;
}


var dummy_params = {
	name: 'test_tourney',
	tournament_type: 'single_elimination',
	hold_third_place_match: false,
	start_at: '04:30:17:30'
};

function createTourney(admin_params=dummy_params){
	var all_params = {};
	all_params.api_key = 'OTt7J6rYLgefYbCPd6XR180z14r1Pu3ySYN6uY7F';
	all_params.tournament_type = admin_params.tournament_type;
	all_params.url = randomString(9, '0123456789abcdefghijklmnopqrstuvwxyz');
	client.tournaments.create({
		tournament: {
			name: admin_params.name,
			url: randomString(9, '0123456789abcdefghijklmnopqrstuvwxyz'),
			tournamentType: admin_params.tournament_type,
		},
		callback: (err, data) => {
			Console.log(err, data);
		}
	});

//subdomain?
//Description?
}

module.exports = {
	createTourney: createTourney
};
