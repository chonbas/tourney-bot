//
const Discord = require('discord.js');
const Console = require('../util/console');
const credentials = require('../../credentials.js');
var db = require('./mongodb');
var constants = require('../util/constants');
const manager = require('../handlers/manager');

var client = new Discord.Client();

var exports = {};

// Stub
exports.stub = (object, msg) => {
	return new Promise((fulfill, reject) => {
		fulfill(object); // if ok, fulfill - next piece needs message
		Console.log(msg);
		reject(); // if fail, reject
	});
};

// Listeners
//
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

/*
/
/ Stage: Initialize
/
*/

// Transition from Init to Setup
exports.transitionInitToSetup = (guild) => {
	return new Promise((fulfill, reject) => {
		guild.createChannel('tourney-general', 'text').then((channel) => {
			return channel.sendMessage('Welcome to the tournament!');
		}).then((message)=> {
			return db.createChannel(message.guild.id, message.channel.id, constants.GENERAL_CHANNEL);
		}).then((ret_val) => {
			if (ret_val === constants.CREATE_SUCCESS) {
				Console.log('Created channels for setup (not implemented)');
				fulfill();
			} else {
				reject();
			}
		}).catch(err => {
			Console.log(err);
			reject();
		});
	});
};

/*
/
/ Stage: Setup
/
*/

// eslint-disable-next-line
exports.setupAddParticipant = (msg, participant_name) => {
	return new Promise((fulfill, reject) => {
        // TODO: give user role, insert in db etc.
		Console.log('Added participant to Discord (not implemented)');

        // TODO: put role_id in db

        // pseudo-join: type "join"
		fulfill(msg); // if ok, fulfill - next piece needs message

		var err = 'Add to Discord failed because XYZ.';
		reject(err); // if fail, reject
	});
};

// Transition from set-up to run
// eslint-disable-next-line
exports.transitionSetupToRun = (guild) => {
	return new Promise((fulfill, reject) => {
		Console.log('Started running Discord tournament (not implemented)');

        // TODO: create channels? not sure
        // TODO: update announce to say tournament is running
        // TODO: message to join channel - can't accept new users
        // maybe also remove permissions


		fulfill(); // once channels are made, call this
		reject(); // if error, reject
	});
};

/*
/
/ Stage: Run
/
*/

// Match Channels
exports.runInitMatchChannels = (guild, matches) => {
	return new Promise((fulfill, reject) => {
		Console.log('  Init-ing match channels for ' + guild.id);

        // TODO: for each match, make a channel and add the right ppl
        // also send a greeting
		matches.forEach((match) => {
			Console.log('    Init match ' + match);
		});

		fulfill();
		reject();
	});
};

// Dispute Channels
exports.runInitDisputeChannels = (guild) => {
	return new Promise((fulfill, reject) => {
		Console.log('  Init-ing disputes for ' + guild.id);

        //TODO: get disputes from db
		var disputes = ['GARBAGE_DISPUTE_1', 'GARBAGE_DISPUTE_2'];

        // TODO: for each dispute, get a jury and make a channel
		disputes.forEach((match) => {
			Console.log('    Init dispute ' + match);
		});

		fulfill();
		reject();
	});
};

exports.runNotifyEndMatches = (guild, matches) => {
	return new Promise((fulfill, reject) => {
		Console.log('  Notifying incomplete matches that time is up for ' + guild.id);

        //TODO: Let users know that they can no longer report scores
        // for now we'll just say "end" or something,
        // but maybe later we can actually check if they
        // finished or are disputing or whatnot
		matches.forEach((match) => {
			Console.log('    End-match notice to ' + match);
		});

		fulfill();
		reject();
	});
};

// Resolvers
exports.runResolveMatch = (guild, match) => {
	return new Promise((fulfill, reject) => {
		Console.log('      Resolving match in Discord:' + match + ' for ' + guild.id);
        // TODO: send a message to the appropriate channel, notifying the users of the outcome.
		fulfill();
		reject();
	});
};

// Logs in client
client.login(credentials.DISCORD_TOKEN).catch((err) => {
	Console.log(err);
	Console.log('\n\nYou must provide a proper Discord API token in credentials.js.');
	process.exit();
}).then(() => {
	Console.log('Logged in');
});

module.exports = exports;
