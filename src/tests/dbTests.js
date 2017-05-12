const db = require('../webservices/mongodb');
const Console = require('../util/console');
const assert = require('assert');
exports = {};


function resetTourney(msg) {
	db.deleteTournament('1234').then((data) =>{
		Console.log(data);
		Console.log(msg);
	}).catch((err)=>{
		Console.log(err);
	});
}

exports.resetDB = () => {
	resetTourney('bam');
};

exports.testTourneyCreation = () => {
	db.createTournament('1234').then((data) =>{
		Console.log(data);
		resetTourney('Tourney Creation PASS');
	}).catch((err) =>{
		Console.log(err);
		resetTourney('Tourney Creation FAIL');
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
				resetTourney('TourneyChallongeSetGet PASS');
			}).catch((err) => {
				Console.log(err);
				resetTourney('TourneyChallongeSetGet FAIL');
			});
		}).catch((err) => {
			Console.log(err);
			resetTourney('TourneyChallongeSetGet FAIL');
		});
	}).catch((err) =>{
		resetTourney('TourneyChallongeSetGet FAIL');
		Console.log(err);
	});
};


// exports.testParticipantCreateGet = () => {
// 	db.createTournament('1234').then((data) =>{
// 		Console.log(data);
// 		Console.log('Tourney Created');
// 		db.createParticipant('1234', 'chon','chonchon').then((data) => {
// 			Console.log(data);
// 			Console.log('Participant Created');
// 			db.setParticipantChallongeID('1234','chonchon','challonge!').then((data)=>{
// 				Console.log(data);
// 				Console.log('Participant Challonge Set');
// 				db.getParticipantChallongeID('1234','chonchon').then((data)=>{
// 					Console.log(data);
// 					Console.log('Participant retrieved with Challonge');
// 					db.removeParticipant('1234','chonchon').then((data)=>{
// 						Console.log('Participant retrieved');
// 						Console.log(data);
// 						resetTourney('Participant Create Get PASS');
// 					}).catch((err)=>{
// 						Console.log(err);
// 						resetTourney('Participant Create Get FAIL');
// 					});
// 				}).catch((err)=>{
// 					Console.log(err);
// 					resetTourney('Participant Create Get FAIL');
// 				});
// 			}).catch((err) => {
// 				Console.log(err);
// 				resetTourney('Participant Create Get FAIL');
// 			});
// 		}).catch((err) => {
// 			Console.log(err);
// 			resetTourney('Participant Create Get FAIL');
// 		});
// 	}).catch((err) =>{
// 		Console.log(err);
// 		resetTourney('Participant Create Get FAIL');
// 	});
// };


module.exports = exports;