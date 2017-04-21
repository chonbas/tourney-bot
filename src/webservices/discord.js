//
const Discord = require('discord.js');
const Console = require('../util/console');
const token = require('../../credentials').DISCORD_TOKEN;
var manager = require('../handlers/manager');

var start_discord_client = () => {
	const client = new Discord.Client();

	client.on('ready', () => {
		Console.log(`Logged in as ${client.user.username}!`);
	});

	client.on('warn', (info) => {
		Console.log(info);
	});

	client.on('error', (err) => {
		Console.error(err);
		process.exit();
	});

	client.on('message', msg => {
		manager.distribute_msg(msg);
	});

	client.login(token).catch((err) => {
		Console.log(err);
		Console.log('\n\nYou must provide a proper Discord API token in credentials.js.');
		process.exit();
	});
};

module.exports = { start_discord_client };