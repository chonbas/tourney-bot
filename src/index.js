const Console = require('./util/console');
const Constants = require('./util/constants');
const dbTests = require('./tests/dbTests.js');

if (Constants.DEBUG){
	dbTests.runDBTests().then( () => {
		Console.log('Tests Run');
	});
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
