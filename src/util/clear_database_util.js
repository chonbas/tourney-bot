const Console = require('console');
var db = require('../webservices/mongodb.js');
var Challonge = require('../webservices/challonge');

Challonge.createTourney('test194tb',[]).then((createstate) => {
	Console.log(createstate);
	db.clearDB().then( (status) => {
		Console.log(status);
		Challonge.removeAllTourneys().then( (c_status) => {
			Console.log(c_status);
			process.exit();
		});
	}).catch( (err) => {
		Console.log(err);
	});
});

