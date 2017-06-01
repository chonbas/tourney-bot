// Listeners
//

const Console = require('../util/console');
const manager = require('../handlers/manager');
const credentials = require('../../credentials.js');

var exportme = (client) => {
	client.on('ready', () => {
		Console.log(`Logged in as ${client.user.username}!`);
	});

	//
	client.on('warn', (info) => {
		Console.log(info);
	});

	//
	client.on('error', (err) => {
		Console.error(err);
		process.exit();
	});

	//
	client.on('message', msg => {
	// never reply to bots
	// TODO: Add this check before release!!
	// if (msg.author.bot) return;
	// only respond to @bot mentions
		if (!msg.isMentioned(client.user)) {
			Console.debug('Message heard, but no @bot so not replying.');
			return;
		}
		manager.distributeMsg(msg);
	});

	// emojis
	client.on('messageReactionAdd', (msgReaction, user) => {
		// TODO: Only manage if our bot message was liked
		manager.distributeReaction(msgReaction, user);
	});

	// Logs in client
	client.login(credentials.DISCORD_TOKEN).catch((err) => {
		Console.log(err);
		Console.log('\n\nYou must provide a proper Discord API token in credentials.js.');
		process.exit();
	}).then(() => {
		Console.log('Logged in');
	});

};

module.exports = exportme;
