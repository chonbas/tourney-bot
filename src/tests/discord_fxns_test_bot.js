// Listeners
//

var discord = require('../webservices/discord');
const Console = require('../util/console');
const credentials = require('../../credentials.js');

var exportme = (client) => {
	client.on('ready', () => {
		Console.log(`Logged in as ${client.user.username}!`);
		Console.log('WARNING: RUNNING AS EMILY\'S TEST BOT!');
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

		//LOGIC FOR COMMANDS
		var cmd = msg.content.split(' ')[1];
		var dat = msg.content.split(' ')[2];

		switch (cmd) {
		case 'sendConfirmInit':
			discord.sendConfirmInit(msg.channel, msg.author);
			break;
		case 'tnti':
			discord.transitionNoToInit(msg.guild, msg.author);
			break;
		case 'sendConfirmCreateTeam':
			discord.sendConfirmCreateTeam(msg.channel, msg.author, 'TEAM_NAME');
			break;
		default:
			discord.stub('message came in', cmd, dat)
			.then(() => {
				Console.log(cmd);
				Console.log(dat);
			});
		}
	});

	// emojis
	client.on('messageReactionAdd', (msgReaction, user) => {
		// TODO: Only manage if our bot message was liked
		discord.receiveConfirmInit(msgReaction, user)
		.then((response) => {
			Console.log('receiveConfirmInit:');
			Console.log(response);
		});
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
