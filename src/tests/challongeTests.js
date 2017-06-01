// var db = require('../webservices/mongodb');
const Console = require('../util/console');
const Challonge = require('../webservices/challonge');
// const assert = require('assert');
exports = {};

var test_id = 'testaroo1';

exports.testTourneyDone = () => {
	return new Promise((fulfill, reject) => {
		Challonge.isTourneyDone(test_id).then( (status) => {
			Console.log(status);
			fulfill('tada');
		}).catch( (err) => {
			Console.log(err);
			reject();
		});
	});
};

exports.testTourneyCreation = () => {
	return new Promise((fulfill, reject) => {
		Challonge.createTourney(test_id).then( () => {
			Console.log('created');
			fulfill('created');
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

exports.testGetWinner = () => {
	return new Promise((fulfill, reject) => {
		Challonge.getTourneyWinner(test_id).then( (status) => {
			Console.log('got winner?');
			fulfill(status);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

module.exports = exports;

if (!module.parent) {
	exports.testTourneyDone().then( (status) => {
		exports.testGetWinner().then( (status) => {
			Console.log(status);
			process.exit();
		}).catch( (err) => {
			Console.log(err);
			process.exit();
		});
		Console.log(status);
	}).catch((err) =>{
		Console.log(err);
		process.exit();
	});
}