// Listeners
//

var discord = require('../webservices/discord');
var notify = require('../webservices/discord_notifications');
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
		if(!client.has_received_a_message){
			Console.log('Role IDs and Names:');
			Console.log(msg.guild.roles.map(r => {return {id: r.id, name: r.name};}));
			Console.log('User IDs and Names:');
			Console.log(msg.guild.members.map(m => {return {id: m.user.id, name: m.user.username};}));
			client.has_received_a_message = true;
		}
		//Console.log(msg.guild.members);
		//LOGIC FOR COMMANDS
		var cmd = msg.content.split(' ')[1];
		var dat = msg.content.split(' ')[2];
		var dat2 = msg.content.split(' ')[3];

		switch (cmd) {
		/*
		TESTING discord_notifications.JS FILE
		*/
		case 'notifyRole':
			var role_id = dat.slice(3, -1);
			Console.log(dat);
			Console.log(role_id);
			notify.notifyRole(msg.guild, role_id, 'DM Role test')
			.then(res => Console.log(res));
			break;
		case 'notifyPlayer':
			var player_id = dat.slice(2, -1);
			Console.log(dat);
			Console.log(player_id);
			notify.notifyPlayer(msg.guild, msg.author.id, 'DM player test')
			.then(res => Console.log(res));
			break;
		case 'deleteDMChannel':
			var player_id2 = dat.slice(2, -1);
			msg.guild.members.get(player_id2).deleteDM();
      break;
		case 'notifyAllPlayers':
			notify.notifyAllPlayers(msg.guild, 'DM all players test')
			.then(res => Console.log(res))
			.catch(res => Console.log(res));
			break;
		/*
		TESTING DISCORD.JS FILE
		*/
		case 'setupNewTeam':
			discord.setupNewTeam(msg.guild, dat)
			.then(role_id => {discord.setupAddToTeam(msg.guild, msg.author.id, role_id);});
			break;
		case 'sendConfirmInit':
			discord.sendConfirmInit(msg.channel, msg.author);
			break;
		case 'tnti':
			discord.transitionNoToInit(msg.guild, msg.author);
			break;
		case 'sendConfirmCreateTeam':
			discord.sendConfirmCreateTeam(msg.channel, msg.author, 'TEAM_NAME');
			break;
		case 'sendConfirmJoinTeam': // the "team creator" is emily's t1 bot
			discord.sendConfirmJoinTeam(msg.channel, msg.author, dat.slice(2,-1),'TEAM_NAME');
			break;
		case 'initMatchChannel':
			var role1_id = dat.slice(3, -1);
			var role2_id = dat2.slice(3, -1);
			Console.log(dat);
			var arr = [];
			arr.push(role1_id);
			arr.push(role2_id);
			discord.runInitMatchChannel(
				msg.guild,
				arr,
				3,
				'ref_id'
			);
			break;
		case 'initDisputeChannel':
			discord.runInitDisputeChannel(
				msg.guild,
				47,
				msg.author.id,
				'312120580956487681'
			);
			break;
		case 'purge': // the "team creator" is emily's t1 bot
			discord.deleteAllTourneyChannels(msg.guild);
			break;
		default:
			Console.log('unrecognized message');
			Console.log(cmd);
			Console.log(dat);
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
		discord.receiveConfirmCreateTeam(msgReaction, user)
		.then((response) => {
			Console.log('receiveConfirmCreateTeam:');
			Console.log(response);
		});
		discord.receiveConfirmJoinTeam(msgReaction, user)
		.then((response) => {
			Console.log('receiveConfirmJoinTeam:');
			Console.log(response);
		});
		discord.receiveDisputeChannelVote(msgReaction, user)
		.then((response) => {
			Console.log('receiveDisputeChannelVote:');
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
