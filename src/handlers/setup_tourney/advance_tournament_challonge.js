// eslint-disable-next-line
var Console = require('../../util/console');
// eslint-disable-next-line
var db = require('../../webservices/mongodb');
// eslint-disable-next-line
var client = require('../../webservices/challonge');

// eslint-disable-next-line
var startChallongeTourney = (msg) => {
	return new Promise((fulfill, reject) => {
		// TODO: tell challonge to start the tournament
		db.getTournamentChallongeID(msg.guild.id).then((t_url)=>{
			client.tournaments.start({
				id: t_url,
				callback: (err, data) => {
					if(err){
						Console.log(err);
						reject();
					}
					else{
						Console.log('Started Challonge tournament');
						Console.log(err, data);
					}
				}
			});
		});

		fulfill(); // once channels are made, call this
		reject(); // if error, reject
	});
};

module.exports = startChallongeTourney;
