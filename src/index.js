// eslint-disable-next-line
const Console = require('./util/console');
const Constants = require('./util/constants');
const dbTests = require('./tests/dbTests.js');

if (Constants.DEBUG){
	dbTests.runDBTests().then( () => {
		Console.log('Tests Run');
	});
}
// eslint-disable-next-line
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
var add_listeners = require('./webservices/add_listeners');

add_listeners(discordclient._client);
