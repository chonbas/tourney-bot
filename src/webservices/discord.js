//
const Discord = require('discord.js');
const Console = require('../util/console');
const credentials = require('../../credentials.js');
var db = require('./mongodb');
var constants = require('../util/constants');

var client = new Discord.Client();

var exports = {};

/*
This is exported so another file can add the Listeners
to break the circular dependency where discord must
require the managers but the things requierd by the handlers
need discord.
*/
exports._client = client;

// Stub
exports.stub = (object, msg) => {
	return new Promise((fulfill, reject) => {
		fulfill(object); // if ok, fulfill - next piece needs message
		Console.log(msg);
		reject(); // if fail, reject
	});
};
/*
███████████████████████████████████████████████████████
  UTILS
███████████████████████████████████████████████████████
*/
/*
Creates a channel and pins a message to the top.
Returns the pinned message in a promise.
*/
var createChannelPinMessage = (guild, channel_name, channel_type, welcome_msg) => {
	return new Promise((fulfill, reject) => {
		var channel_created;
		var message_created;
		guild.createChannel('tourney-' + channel_name, 'text').then((channel) => {
			channel_created = channel;
			return channel.send(welcome_msg);
		}).then((message)=> {
			message_created = message;
			return message.pin();
		}).then(()=> {
			return db.createChannel(guild.id, channel_created.id, channel_type);
		}).then((ret_val) => {
			if (ret_val == constants.CREATE_SUCCESS) {
				Console.log('DISCORD: in ' + guild.id + ' created tourney-' + channel_name);
				fulfill(message_created);
			}
			reject();
		}).catch(err => {
			Console.log(err);
			reject(err);
		});
	});
};

/*
Gives only the allowed roles or users (use an array)
permission to write.

allowed is an array!!

Returns the pinned message in a promise.
*/
var permissWritesForOnly = (channel, allowed) => {
	return new Promise((fulfill, reject) => {
		//remove all permissions
		var everyone_role = channel.guild.roles.find('name', '@everyone');
		channel.overwritePermissions(
			everyone_role,
			{ 'SEND_MESSAGES': false }
		)
		.then(() => {
			var promise_array = allowed.map((allowee) => {
				return channel.overwritePermissions(
					allowee,
					{ 'SEND_MESSAGES': true }
				);
			});
			var all_set = Promise.all(promise_array);
			return all_set;
		}).then(() => {
			fulfill(channel);
		}).catch(err => reject(err));
	});
};


/*
███████████████████████████████████████████████████████
  STAGE: NO TOURNAMENT
███████████████████████████████████████████████████████
*/

exports.transitionNoToInit = (guild, init_user) => {
	//create a channel for the bot to talk to the initer in
	return new Promise((fulfill, reject) => {
		createChannelPinMessage(
			guild,
			'init',
			constants.INIT_CHANNEL,
			'Init tourney welcome message: write something here')
		.then((message) => {
			return permissWritesForOnly(message.channel, [init_user]);
		}).then(() => {fulfill();})
		.catch(err => reject(err));
	});
};

/*
███████████████████████████████████████████████████████
  STAGE: INITIALIZE
███████████████████████████████████████████████████████
*/

// Transition from Init to Setup
exports.transitionInitToSetup = (guild) => {
	return new Promise((fulfill, reject) => {
		createChannelPinMessage(
			guild,
			'general',
			constants.GENERAL_CHANNEL,
			'Welcome to the tournament!')
		.then(() => {fulfill();})
		.catch(err => reject(err));
	});
};


/*
███████████████████████████████████████████████████████
  Stage: Setup
███████████████████████████████████████████████████████
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
