const Console = require('console');
var db = require('../webservices/mongodb.js');
var Challonge = require('../webservices/challonge');

exports = {};

exports.wipeDB = () => {
	return new Promise((fulfill, reject) => {
		db.clearDB().then( (status) => {
			Console.log(status);
			Challonge.removeAllTourneys().then( (c_status) => {
				Console.log(c_status);
				fulfill();
			}). catch(( err) => {
				Console.log(err);
				reject(err);
			});
		}).catch( (err) => {
			Console.log(err);
		});
	});
};

module.exports = exports;

//If script called from console, wipe db , else import function
if (!module.parent) {
	exports.wipeDB();
}