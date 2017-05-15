// const db = require('../webservices/mongodb');
// const Console = require('../util/console');
// const assert = require('assert');
// exports = {};




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