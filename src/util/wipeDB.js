const Console = require('console');
var db = require('../webservices/mongodb.js');
var msg_db = require('../webservices/mongodb_messages.js');
var Challonge = require('../webservices/challonge');

var wipeDB = () => {
	return new Promise((fulfill, reject) => {
		db.clearDB()
		.then(() => {
			return msg_db.clearDB();
		})
		.then(() => {
			return Challonge.removeAllTourneys();
		})
		.then( (status) => {
			fulfill(status);
		})
		.catch( (err) => {
			Console.log(err);
			reject(err);
		});
	});
};

module.exports = wipeDB;

//If script called from console, wipe db , else import function
if (!module.parent) {
	wipeDB().then( (status) => {
		Console.log(status);
		process.exit();
	});
}
