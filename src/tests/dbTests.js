const db = require('../webservices/mongodb');
const Console = require('../util/console');
const assert =require('assert');
exports = {};

exports.testTourneyCreation = () => {
	db.createTournament('1234').then((data) =>{
		Console.log(data);
		db.deleteTournament('1234').then((data) =>{
			Console.log(data);
		}).catch((err)=>{
			Console.log(err);
		});
	}).catch((err) =>{	
		Console.log(err);
	});	
};

exports.testTourneyChallongeSetGet = () => {
	db.createTournament('1234').then((data) =>{
		Console.log(data);
		db.setChallongeID('1234', 'challonge').then((data) => {
			Console.log(data);
			db.getChallongeID('1234').then((data) => {
				assert.equal(data, 'challonge');
				Console.log(data);
				db.deleteTournament('1234').then((data) =>{
					Console.log(data);
					Console.log('\n\n TEST TOURNEY CHALLONGE SET GET\n\n SUCCESS!!');
				}).catch((err)=>{
					Console.log(err);
					Console.log('\n\n TEST TOURNEY CHALLONGE SET GET\n\n FAIL!!');
				});
			}).catch((err) => {
				Console.log(err);
				Console.log('\n\n TEST TOURNEY CHALLONGE SET GET\n\n FAIL!!');
			});
		}).catch((err) => {
			Console.log(err);
			Console.log('\n\n TEST TOURNEY CHALLONGE SET GET\n\n FAIL!!');
		});
	}).catch((err) =>{
		db.deleteTournament('1234').then((data) =>{
			Console.log(data);
		}).catch((err)=>{
			Console.log(err);
			Console.log('\n\n TEST TOURNEY CHALLONGE SET GET\n\n FAIL!!');
		});
		Console.log(err);
	});	
};

module.exports = exports;