// Listeners
//

const Console = require('../util/console');
const manager = require('../handlers/manager');
const str_gen = require('../webservices/discord_util/message_generator');
const credentials = require('../../credentials.js');

var exportme = (client) => {
	client.on('ready', () => {
		Console.log(`Logged in as ${client.user.username}!`);
		Console.log('Use this link to invite the bot to your server:');
		Console.log(`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=268631120`);
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
		//never reply to self
		if(msg.author.id == client.user.id){
			return;
		}
	// WE ARE NOT EQUIPPED TO HANDLE DM CHANNELS
		if(!msg.guild){
			msg.reply('Sorry, I\'m not equipped to handle messages not in a guild.');
			return
		}
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

	/*
	whenever the bot joins a server,
	send a message to the guild's default channel
	instructing users what to do.
	*/
	client.on('guildCreate', guild => {
		guild.defaultChannel.send(
			str_gen.stub('TOURNEYBOT HAS JOINED THE SERVER, MUHAHAHA')
		)
		.then(() => {})
		.catch(err => Console.log(err));
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
