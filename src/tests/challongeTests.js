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
			fulfill('created');
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

exports.testTourneyDeletion = () => {
	return new Promise((fulfill, reject) => {
		Challonge.removeAllTourneys().then( () => {
			fulfill('deleted');
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

exports.testGetWinner = () => {
	return new Promise((fulfill, reject) => {
		Challonge.getTourneyCreation(test_id).then( (status) => {
			Console.log('got winner?');
			fulfill(status);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

exports.testStash = () => {
	return new Promise((fulfill, reject) => {
		Challonge.stashTourney(test_id).then( (status) => {
			Console.log('stashed');
			fulfill(status);
		}).catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

module.exports = exports;

if (!module.parent) {
	exports.testTourneyCreation().then( (status) => {
		Console.log(status);
		exports.testStash().then( (status) => {
			Console.log(status);
			exports.testTourneyDeletion().then( (status) => {
				Console.log(status);
				process.exit();
			}).catch( (err) => {
				Console.log(err);
				process.exit();
			});
		}).catch( (err) => {
			Console.log(err);
			process.exit();
		});
	}).catch((err) =>{
		Console.log(err);
		exports.testTourneyDeletion().then( (status) => {
			Console.log(status);
			process.exit();
		}).catch( (err) => {
			Console.log(err);
			process.exit();
		});
	});
}