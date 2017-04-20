const Console = require('./util/console');
try {
	//check that credentials file exists
	// eslint-disable-next-line no-unused-vars
	const credentials = require ('../credentials.js');
} catch (err) {
	Console.log('You must provide a credentials file with API tokens, etc.');
	process.exit();
}
const discordclient = require ('./discord');
const mongodbclient = require ('./mongodb');

mongodbclient.start_mongodb_client()
	.then(() => {
		discordclient.start_discord_client();
	});