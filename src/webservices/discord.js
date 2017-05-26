//
const Discord = require('discord.js');
const Console = require('../util/console');
const util = require('./discord_util/util');
const str_gen = require('./discord_util/message_generator');
// var db = require('./mongodb');
var constants = require('../util/constants');

var client = new Discord.Client();

var exports = {};

// Stub
exports.stub = (obj1, obj2, obj3, obj4, obj5, msg) => {
	return new Promise((fulfill, reject) => {
		fulfill(obj1, obj2, obj3, obj4, obj5); // if ok, fulfill - next piece needs message
		Console.log(msg);
		reject(); // if fail, reject
	});
};

/*
███████████████████████████████████████████████████████
  STAGE: NO TOURNAMENT
███████████████████████████████████████████████████████
*/

/*
Does:
creates channel
sets permission to only init-user
*/
exports.transitionNoToInit = (guild, init_user) => {
	return new Promise((fulfill, reject) => {
		util.createChannelPinMessage(
			guild,
			'init',
			constants.INIT_CHANNEL,
			str_gen.tourney_init_channel(init_user)
		).then((message) => {
			return util.setPermissions(
				message.channel,
				['SEND_MESSAGES'],
				[init_user]);
		}).then(() => {fulfill();})
		.catch(err => reject(err));
	});
};

/*
███████████████████████████████████████████████████████
  STAGE: INITIALIZE
███████████████████████████████████████████████████████
*/

/*
transitionInitToSetup(guild)
Creates a general channel.
Creates an announce channel.
Creates a join channel.
*/
exports.transitionInitToSetup = (guild) => {
	return new Promise((fulfill, reject) => {
		var ps = [
			util.createChannelPinMessage(
				guild,
				'announce',
				constants.ANNOUNCE_CHANNEL,
				str_gen.tourney_announce_channel()
			).then((message) => {
				return util.setPermissions(
					message.channel,
					['SEND_MESSAGES'],
					[]);
			}),
			util.createChannelPinMessage(
				guild,
				'join',
				constants.JOIN_CHANNEL,
				str_gen.stub('join message', 'join message')
			),
			util.createChannelPinMessage(
				guild,
				'general',
				constants.GENERAL_CHANNEL,
				str_gen.tourney_general_channel()
			)
		];
		Promise.all(ps)
		.then(() => fulfill())
		.catch(() => reject());
	});
};


/*
███████████████████████████████████████████████████████
  Stage: Setup
███████████████████████████████████████████████████████
*/

/*
Fulfills with role_id
*/
exports.setupNewTeam = (guild, team_name) => {
	return new Promise((fulfill, reject) => {
		guild.createRole({
			name: team_name,
			color: 'BLUE'
		})
		.then((role) => {fulfill(role.id);})
		.catch((err) => {reject(err);});
	});
};

/*
Fulfills with nothing. Rejects on error.
*/
exports.setupAddToTeam = (guild, user, role_id) => {
	return new Promise((fulfill, reject) => {
		var role = guild.roles.get(role_id);
		user.addRole(role)
		.then(() => {fulfill();})
		.catch(() => {reject();});
	});
};



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
███████████████████████████████████████████████████████
  Stage: Run
███████████████████████████████████████████████████████
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

/*
███████████████████████████████████████████████████████
  Stage: Close
███████████████████████████████████████████████████████
*/

exports.deleteAllTourneyChannels = (guild) => {
	guild.channels
	.filter(c => {return c.name.includes('tourney-');})
	.deleteAll();
};

/*
This is exported so another file can add the Listeners
to break the circular dependency where discord must
require the managers but the things requierd by the handlers
need discord.
*/
exports._client = client;

module.exports = exports;
