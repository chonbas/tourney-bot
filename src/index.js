const Console = require('./util/console');

var DEBUG = false;


if (DEBUG){
	var db_tests = require('./tests/dbTests');
	// db_tests.testTourneyCreation();
	// db_tests.testTourneyChallongeSetGet();
	db_tests.testParticipantCreateGet();
	// db_tests.resetDB();
}

var credentials;
try {
	//check that credentials file exists
	// eslint-disable-next-line no-unused-vars
	credentials = require('../credentials.js');
} catch (err) {
	Console.log('You must provide a credentials file with API tokens, etc.');
	process.exit();
}
const discordclient = require('./webservices/discord');
const manager_listeners = require('./handlers/manager_listeners');


manager_listeners.addListeners(discordclient);
discordclient.login(credentials.DISCORD_TOKEN).catch((err) => {
	Console.log(err);
	Console.log('\n\nYou must provide a proper Discord API token in credentials.js.');
	process.exit();
}).then(() => {
	Console.log('Logged in');
});





