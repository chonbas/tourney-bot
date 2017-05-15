var Console = require('../../util/console');
var client = require('../../webservices/challonge');
// eslint-disable-next-line
var db = require('../../webservices/mongodb');

// TODO: Determine what data is needed from NLP extraction
// and properly feed into this function.
// eslint-disable-next-line
var addParticipantChallonge = (msg, participant_name) => {
	return new Promise((fulfill, reject) => {
		// TODO: Actually add to tournament.
		db.getTournamentChallongeID(msg.guild.id).then((t_url)=>{
			Console.log('dd_p_url = '+t_url);
			var p_name = participant_name;
			client.participants.create({
				id: t_url,
				participant: {
					name: p_name
				},
				callback: (err, data) => {
					if(err){
						Console.log(err);
						reject();
					}
					else{
						Console.log(err, data);
					}
				}
			});
		});
		Console.log('Added participant to Challonge (not implemented)');

		// TODO: put challonge_id in db

		// pseudo-join: type "join"
		fulfill(msg); // if ok, fulfill - next piece needs message

		var err = 'Add to Challonge failed because XYZ.';
		reject(err); // if fail, reject
	});
};

module.exports = addParticipantChallonge;
