var mongoose = require('mongoose');
const Console = require('../../util/console');
var Guild = require('./guildSchema.js');

//initialize database, and report access
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', (err) =>{
	Console.error.bind(Console, 'connection error:');
	Console.log(err);
	Console.log('\n\nYou must be running MongoDB. If you are, check the error above for more information.');
});
db.once('open', () => {
	Console.log('Connected to MongoDB. Clearing DB...');
	Guild.remove({}, () => {
		Console.log('Cleared!');
		process.exit();
	});
});
