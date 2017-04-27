//
const Console = require('./util/console');
try {
	//check that credentials file exists
	// eslint-disable-next-line no-unused-vars
	const credentials = require ('../credentials.js');
} catch (err) {
	Console.log('You must provide a credentials file with API tokens, etc.');
	process.exit();
}
const discordclient = require ('./webservices/discord');
const mongodbclient = require ('./webservices/mongodb');

mongodbclient.startMongodbClient()
	.then(() => {
		discordclient.startDiscordClient();
	});