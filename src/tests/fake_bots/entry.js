/**
TESTBOTS ENTRY FILE

Creates a bot that:
1. echoes messages at anyone who has target_string
   in their display name in a guild.
	   - if echoing and has "stop", does not echo the message
2. echoes reactions of someone who reacts to a message
   the bot sent. Write "stop" to stop reaction echo.

*/

var target_string = 'tourney'; // must be lowercase

// below here is just code

const Discord = require('discord.js');
var Console = require('../../util/console');

var tokens = require('../../../credentials').TEST_TOKENS;

if(tokens.length === 0 || tokens[0].length < 50){
	Console.log('You must provide at least one bot token.');
	process.exit();
}

var testbots = [];

var echoToTargets = (msg, client_id) => {
	// exclude my test buddies
	var potential_targets = msg.guild.members.filter((member) => {
		if(testbots.includes(member.id)) return false;
		return true;
	});

	// find the actual target by nickname having "tourney"
	var targets = potential_targets.filter((member) => {
		if(member.displayName.toLowerCase().includes(target_string)) {
			return true;
		}
		return false;
	});

	targets.map((target) => {
		var str = msg.content.replace(client_id, target.id);
		msg.channel.sendMessage(str);
	});
};

tokens.forEach((token) => {
	const client = new Discord.Client();

	client.on('ready', () => {
		var link = `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=121920`;
		Console.log(`${client.user.username} ready for action!\nAdd with\n\n${link}\n\n`);
		testbots.push(client.user.id);
		client.do_emoji_echo = false;

		//send a "i'm awake" message
		client.guilds.map((guild) => {
			guild.defaultChannel.sendMessage(`${client.user.username} has arrived.`);

		});
	});

	client.on('message', msg => {
		// if I'm mentioned
		if (!msg.isMentioned(client.user)) {return;}

		// in a guild server only
		if (msg.channel.type === 'text'){
			if (client.do_emoji_echo && msg.content.toLowerCase().includes('stop')){
				client.do_emoji_echo = false;
				msg.reply('Stopped echoing emojis.');
				Console.log(`<@${client.user.username}> stopping echoing emojis.`);
			} else {
				echoToTargets(msg, client.user.id);
			}
		}

	});

	client.on('messageReactionAdd', (msgRxn, user) => {
		// if should echo, do so
		if (client.do_emoji_echo
		&& user.id === client.emoji_echoer) {
			msgRxn.message.react(msgRxn.emoji)
			.catch(err => Console.log(err));
		}

		// if shouldn't and my message was linked,
		//start listening for emoji echos
		if(!client.do_emoji_echo
			&& msgRxn.message.author.id === client.user.id){
			Console.log(`<@${client.user.username}> echoing emojis.`);
			client.emoji_echoer = user.id;
			client.do_emoji_echo = true;
			msgRxn.message.channel.sendMessage(
				`<@${user.id}> Echoing emojis... (write "stop" at me to stop)`
			)
			.catch(err => Console.log(err));
		}
	});

	client.login(token);
});
