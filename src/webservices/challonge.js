const challonge = require('challonge');
const Console = require('../util/console');
const token = require('../../credentials').CHALLONGE_TOKEN;
const crypto = require('crypto-js/sha256');
var constants = require('../util/constants');

const client = challonge.createClient({
	apiKey: token
});

var exports = {};

var getChallongeURL = (guild_id) => {
	return 'TB_' + guild_id;
};

exports.createTourney = (guild_id, parameters={}) => {
	return new Promise((fulfill, reject) => {
		var tournament =  parameters;
		tournament['url'] = getChallongeURL(guild_id);
		client.tournaments.create({
			tournament: tournament,
			callback: (err, response) => {
				if(err){
					Console.log(err);
					reject(err);
				}else {
					Console.log('Started Challonge tournament at: challonge.com/' + getChallongeURL(guild_id));
					Console.log(response);
					fulfill(getChallongeURL(guild_id));
				}
			}
		});
	});
};

exports.isTourneyDone = (guild_id) => {
	return new Promise( (fulfill, reject) => {
		client.tournaments.show({
			id:getChallongeURL(guild_id),
			callback: (err, response) => {
				if (err) {
					Console.log(err);
					reject(err);
				} else {
					var progress = response['tournament']['progressMeter'];
					if (progress === 100){
						fulfill(true);
					} else {
						fulfill(false);
					}
				}
			}
		});
	});
};

exports.deleteTourney = (guild_id) => {
	return new Promise( (fulfill, reject) => {
		client.tournaments.destroy({
			id: getChallongeURL(guild_id),
			callback: (err, response) => {
				if (err){
					Console.log(err);
					reject(err);
				} else {
					Console.log('Deleting tournament at: challonge.com/' + response.tournament.url);
					fulfill(constants.REMOVE_SUCCESS);
				}
			}
		});
	});
};

var delete_tourney = (url) => {
	return new Promise( (fulfill, reject) => {
		client.tournaments.destroy({
			id: url,
			callback: (err, response) => {
				if (err){
					Console.log(err);
					reject(err);
				} else {
					Console.log('Deleting tournament at: challonge.com/' + response.tournament.url);
					fulfill(constants.REMOVE_SUCCESS);
				}
			}
		});
	});
};

exports.finalizeTourney = (guild_id) => {
	return new Promise( (fulfill, reject) => {
		client.tournaments.finalize({
			id: getChallongeURL(guild_id),
			callback: (err, response) => {
				if (err){
					Console.log(err);
					reject(err);
				} else {
					Console.log('Finalized tournament at: challonge.com/' + getChallongeURL(guild_id));
					Console.log(response);
					fulfill(constants.CLOSE_TOURNEY);
				}
			}
		});
	});
};

exports.getTourney = (guild_id) => {
	return new Promise( (fulfill, reject) => {
		client.tournaments.show({
			id: getChallongeURL(guild_id),
			callback: (err, tourney) =>{
				if (err) {
					Console.log(err);
					reject(err);
				} else {
					fulfill(tourney);
				}
			}
		});
	});
};

exports.stashTourney = (guild_id) => {
	return new Promise( (fulfill, reject) => {
		var new_url = crypto(Date.now().toString()).toString().substring(0,constants.MAX_STASH_URL_LENGTH);
		client.tournaments.update({
			id: getChallongeURL(guild_id),
			tournament: {
				url: new_url
			},
			callback: (err, data) =>{
				if (err) {
					Console.log(err);
					reject(err);
				} else {
					Console.log(data);
					fulfill(new_url);
				}
			}
		});
	});
};

exports.resetTourney = (guild_id) => {
	return new Promise( (fulfill, reject) => {
		client.tournaments.reset({
			id: getChallongeURL(guild_id),
			callback: (err, tourney) =>{
				if (err) {
					Console.log(err);
					reject(err);
				} else {
					Console.log(tourney);
					fulfill(constants.UPDATE_SUCCESS);
				}
			}
		});
	});
};

exports.startTourney = (guild_id) => {
	return new Promise( (fulfill, reject) => {
		client.tournaments.start({
			id: getChallongeURL(guild_id),
			callback: (err, tourney) =>{
				if (err) {
					Console.log(err);
					reject(err);
				} else {
					fulfill(tourney);
				}
			}
		});
	});
};

exports.updateTourney = (guild_id, parameters) => {
	return new Promise( (fulfill, reject) => {
		client.tournaments.update({
			id: getChallongeURL(guild_id),
			tournament: parameters,
			callback: (err, data) =>{
				if (err) {
					Console.log(err);
					reject(err);
				} else {
					Console.log(data);
					fulfill(constants.UPDATE_SUCCESS);
				}
			}
		});
	});
};

exports.processTourneyCheckins = (guild_id) => {
	return new Promise( (fulfill, reject) => {
		client.tournaments.processCheckIns({
			id: getChallongeURL(guild_id),
			callback: (err, data) =>{
				if (err) {
					Console.log(err);
					reject(err);
				} else {
					Console.log(data);
					fulfill(constants.UPDATE_SUCCESS);
				}
			}
		});
	});
};

exports.removeAllTourneys = () => {
	return new Promise( (fulfill, reject) => {
		client.tournaments.index({
			callback: (err, tourneys) => {
				if(err){
					Console.log(err);
					reject(err);
				}
				//get array of tournaments
				var arr = Object.keys(tourneys).map(key => tourneys[key] );
				//filter out not-api-made tournaments (Emily has tournaments to keep)
				var delete_mes = arr.filter(t => {return t.tournament.createdByApi;} );
				//get promises to delete all tournaments
				var promises = delete_mes.map(t => {
					return delete_tourney(t.tournament.url);
				});

				//get promise based on when all deletes are done
				var result = Promise.all(promises);
				// return with a status message
				result
				.then(() => fulfill('Deleted all API-made tournaments.'))
				.catch(() => reject('Error deleting all API-made tournaments.'));
			}
		});
	});
};

exports.getMatchList = (guild_id) => {
	return new Promise( (fulfill, reject) => {
		client.matches.index({
			id: getChallongeURL(guild_id),
			callback: (err, matches) =>{
				if (err) {
					Console.log(err);
					reject(err);
				} else {
					fulfill(matches);
				}
			}
		});
	});
};

exports.getMatch = (guild_id, match_id) => {
	return new Promise( (fulfill, reject) => {
		client.matches.show({
			id: getChallongeURL(guild_id),
			matchId: match_id,
			callback: (err, match) =>{
				if (err) {
					Console.log(err);
					reject(err);
				} else {
					fulfill(match);
				}
			}
		});
	});
};

exports.updateMatch = (guild_id, match_id, winner_id, scores) => {
	return new Promise( (fulfill, reject) => {
		client.matches.update({
			id: getChallongeURL(guild_id),
			matchId: match_id,
			match: {
				scoresCsv: scores,
				winnerId: winner_id,
			},
			callback: (err, data) =>{
				if (err) {
					Console.log(err);
					reject(err);
				} else {
					Console.log(data);
					fulfill(constants.UPDATE_SUCCESS);
				}
			}
		});
	});
};

exports.createParticipant = (guild_id, name) => {
	return new Promise( (fulfill, reject) => {
		client.participants.create({
			id: getChallongeURL(guild_id),
			participant: {
				name: name
			},
			callback: (err, participant) =>{
				if (err) {
					Console.log(err);
					reject(err);
				} else {
					Console.log('HEY HERE');
					Console.log(participant);
					fulfill(participant.participant.id);
				}
			}
		});
	});
};

exports.removeParticipant = (guild_id, part_id) => {
	return new Promise( (fulfill, reject) => {
		client.participants.destroy({
			id: getChallongeURL(guild_id),
			participantId: part_id,
			callback: (err, data) =>{
				if (err) {
					Console.log(err);
					reject(err);
				} else {
					Console.log(data);
					fulfill(constants.REMOVE_SUCCESS);
				}
			}
		});
	});
};

exports.getParticipant = (guild_id, part_id) => {
	return new Promise( (fulfill, reject) => {
		client.participants.show({
			id: getChallongeURL(guild_id),
			participantId: part_id,
			callback: (err, participant) =>{
				if (err) {
					Console.log(err);
					reject(err);
				} else {
					fulfill(participant);
				}
			}
		});
	});
};

exports.updateParticipant = (guild_id, part_id, params) => {
	return new Promise( (fulfill, reject) => {
		client.participant.update({
			id: getChallongeURL(guild_id),
			participantId: part_id,
			participant:params,
			callback: (err, response) =>{
				if (err) {
					Console.log(err);
					reject(err);
				} else {
					Console.log(response);
					fulfill(constants.UPDATE_SUCCESS);
				}
			}
		});
	});
};

exports.randomizeParticipantSeeds = (guild_id) => {
	return new Promise( (fulfill, reject) => {
		client.participants.randomize({
			id: getChallongeURL(guild_id),
			callback: (err, response) =>{
				if (err) {
					Console.log(err);
					reject(err);
				} else {
					Console.log(response);
					fulfill(constants.UPDATE_SUCCESS);
				}
			}
		});
	});
};

exports.getTourneyParticipants = (guild_id) => {
	return new Promise( (fulfill, reject) => {
		client.participants.index({
			id: getChallongeURL(guild_id),
			callback: (err, participants) =>{
				if (err) {
					Console.log(err);
					reject(err);
				} else {
					fulfill(participants);
				}
			}
		});
	});
};


exports.getTourneyWinner = (guild_id) => {
	return new Promise( (fulfill, reject) => {
		exports.getTourneyParticipants(guild_id).then( (participants)=>{
			for (var k in Object.keys(participants)){
				var cur_part = participants[k]['participant'];
				Console.log(cur_part);
				if (cur_part['finalRank'] === 1){
					fulfill(cur_part['id']);
					return;
				}
			}
			fulfill(null);
		}).catch( (err) =>{
			Console.log(err);
			reject(err);
		});
	});
};

module.exports = exports;
