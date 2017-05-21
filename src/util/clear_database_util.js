const Console = require('console');
var db = require('../webservices/mongodb.js');
var Challonge = require('../webservices/challonge');

db.clearDB().then( (status) => {
	Console.log(status);
	Challonge.removeAllTourneys().then( (c_status) => {
		Console.log(c_status);
		process.exit();
	});
}).catch( (err) => {
	Console.log(err);
});