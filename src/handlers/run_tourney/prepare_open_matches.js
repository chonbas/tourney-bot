var Console = require('../../util/console');
var constants = require('../../util/constants');
var db = require('../../webservices/mongodb');
const discord = require('../../webservices/discord');
const challonge = require('../../webservices/challonge');

var convertMatchesTArray = (matches) => {
	var arr = [];
	for(var match in matches){
		let m = matches[match].match;
		m.name = match;
		arr.push(m);
	}
	return arr;
};

var prep_one_match = (guild, match) => {
	return new Promise((fulfill, reject) => {
		var guild_id = guild.id;
		var match_number = match.name;
		var ref_id = match.id;
		var promises = [
			db.getRoleIDByChallongeID(guild_id, match.player1Id),
			db.getRoleIDByChallongeID(guild_id, match.player2Id)
		];
		Promise.all(promises)
		.then((rets) => {
			return discord.runInitMatchChannel(guild, rets, match_number, ref_id);
		})
		.then(() => {
			fulfill();
		})
		.catch(err => {
			Console.log(err);
			reject(err);
		});
		//discord.runInitMatchChannel(guild, players, match_number, ref_id)
	});
};

var prepare_open_matches = (guild) => {
	return new Promise((fulfill, reject) => {

		Console.log('Preparing open matches');
		challonge.getMatchList(guild.id)
		.then((ms) => {
			var matches = convertMatchesTArray(ms);
			var promises = matches
			.filter((m) => {return m.state == 'open';})
			.map((m) => {
				return db.getChannelChannelIDByRefID(guild.id, m.id)
				.then((ret) => {
					if(ret == constants.NO_CHANNEL){
						return prep_one_match(guild, m);
					}
					return Promise.resolve();
				});
			});
			Promise.all(promises)
			.then((rets) => {
				Console.log(rets);
			});
		}).catch(err => reject(err));
	});
};

module.exports = prepare_open_matches;
