//
const Discord = require('discord.js');
const Console = require('../util/console');
const util = require('./discord_util/util');
const str_gen = require('./discord_util/message_generator');
const discord_constants = require('./discord_util/constants');

// var db_m = require('./mongodb_messages');
var challonge = require('./challonge');
var constants = require('../util/constants');

var client = new Discord.Client();

var exports = {};

/*
███████████████████████████████████████████████████████
  STAGE: NO TOURNAMENT
███████████████████████████████████████████████████████
*/

/*
Send Confirm Init
Sends a question asking if a user wants to init a tournament.
channel: channel object to send the message
init_user: user object
*/
exports.sendConfirmInit = (channel, init_user) => {
	return new Promise((fulfill, reject) => {
		util.sendConfirmMessage(
			channel,
			str_gen.stub(`Sure you want to make a tourney, <@${init_user.id}>?`, 'init tourney confirm'),
			discord_constants.INIT_MESSAGE,
			init_user.id,
			init_user.id,
			discord_constants.EMOJI_YN
		)
		.then(() => fulfill())
		.catch((err) => reject(err));
	});
};

/*
Receive Confirm Init
Examines a message reaction to determine if the
user who created the reaction said yes or no.

channel: channel object to send the message
init_user: user object

Returns: Promise<object>
Fulfills: with object like this:
{ status: STATUS, payload: 'no payload'}

Status is one of a few things:
EMOJI_YES: user said yes
EMOJI_NO: user said no
EMOJI_INVALID: wrong user, message, or emoji, so ignore.
  If invalid, payload is an error message containing details
	about why the reaction was invalid.
*/
exports.receiveConfirmInit = (msgRxn, user) => {
	return util.receiveYNConfirmMessage(
		msgRxn,
		user,
		discord_constants.INIT_MESSAGE
	);
};

/*
Does:
creates channel
sets permission to only init-user
*/
exports.transitionNoToInit = (guild, init_user) => {
	return new Promise((fulfill, reject) => {
		var msg = null;
		util.createChannelPinMessage(
			guild,
			'init',
			constants.INIT_CHANNEL,
			str_gen.tourney_init_channel(init_user)
		).then((message) => {
			msg = message;
			return util.setPermissions(
				message.channel,
				['SEND_MESSAGES'],
				[init_user],
				client);
		}).then(() => {fulfill(msg.channel);})
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
		var tourney_url = null;
		var ps = [
			challonge.getTourney(guild.id).then( (tour) =>{
				tourney_url = tour.tournament.url;
				return util.createChannelPinMessage(
					guild,
					'announce',
					constants.ANNOUNCE_CHANNEL,
					str_gen.tourney_announce_channel(tourney_url)
				);
			})
			.then((message) => {
				return util.setPermissions(
					message.channel,
					['SEND_MESSAGES'],
					[],
					client);
			}),
			util.createChannelPinMessage(
				guild,
				'join',
				constants.JOIN_CHANNEL,
				str_gen.tourney_join_channel()
			),
			util.createChannelPinMessage(
				guild,
				'general',
				constants.GENERAL_CHANNEL,
				str_gen.tourney_general_channel()
			),
			util.createChannelPinMessage(
				guild,
				'dispute',
				constants.JURY_CHANNEL,
				str_gen.tourney_dispute_channel()
			),
			guild.createRole({
				name: discord_constants.GENERAL_ROLE_NAME
			})
			.then((role) => {
				return role.setMentionable(true);
			})
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
Send Confirm Init
Sends a question asking if a user wants to init a tournament.
channel: channel object to send the message
init_user: user object
*/
exports.sendConfirmCreateTeam = (channel, init_user, team_name) => {
	return util.sendConfirmMessage(
		channel,
		str_gen.stub(`Sure you want to make team [${team_name}], <@${init_user.id}>?`, 'init team confirm'),
		discord_constants.TEAM_CREATE,
		init_user.id,
		init_user.id,
		discord_constants.EMOJI_YN,
		team_name
	);
};

/*
Receive Confirm Create Team
On failure, returns object with obj.status=EMOJI_INVALID
On succes, returns {
 status: [status],
 payload: team_name
}
*/
exports.receiveConfirmCreateTeam = (msgRxn, user) => {
	return util.receiveYNConfirmMessage(
		msgRxn,
		user,
		discord_constants.TEAM_CREATE
	);
};

/*
Send Confirm Join Team
Asks team creator if they want to let joiner join.
channel: object
joiner: user object
team_creator_id: just the user ID
team_name: string
*/
exports.sendConfirmJoinTeam = (channel, joiner, team_creator_id, team_name) => {
	return util.sendConfirmMessage(
		channel,
		str_gen.stub(`Hey <@${team_creator_id}>], can <@${joiner.id}> join ${team_name}?`, 'join team confirm'),
		discord_constants.TEAM_LEADER_JOIN_MESSAGE,
		joiner.id,
		team_creator_id,
		discord_constants.EMOJI_YN,
		//payload
		{
			new_teammate_id: joiner.id,
			team_name: team_name
		}
	);
};

/*
Receive Join Confirm

Returns: Promise<object>
see payload from sendConfirmJoinTeam for properties, etc.
*/
exports.receiveConfirmJoinTeam = (msgRxn, user) => {
	return util.receiveYNConfirmMessage(
		msgRxn,
		user,
		discord_constants.TEAM_LEADER_JOIN_MESSAGE
	);
};

/*
Fulfills with role_id
*/
exports.setupNewTeam = (guild, team_name) => {
	return new Promise((fulfill, reject) => {
		var role_id = null;
		guild.createRole({
			name: 'tourney-' + team_name
		})
		.then((role) => {
			role_id = role.id;
			return role.setMentionable(true);
		})
		.then((role) => {
			return role.setHoist(true);
		})
		.then((role) => {
			return role.setPosition(0);
		})
		.then(() => {
			fulfill(role_id);
		})
		.catch((err) => {reject(err);});
	});
};

/*
Fulfills with nothing. Rejects on error.
*/
exports.setupAddToTeam = (guild, user_id, role_id) => {
	return new Promise((fulfill, reject) => {
		var guild_user = guild.members.get(user_id);
		Console.log('Discord role_id: ');
		Console.log(role_id);
		var role = guild.roles.get(role_id);
		guild_user.addRole(role)
		.then(() => {
			var general_role = guild.roles.find('name', discord_constants.GENERAL_ROLE_NAME);
			return guild_user.addRole(general_role);
		})
		.then(() => {fulfill();})
		.catch(() => {reject();});
	});
};

/*
Edits announce message to indicate new tournament states.
Sends message to Join channel indicating you can't join.
*/
exports.transitionSetupToRun = (guild) => {
	return new Promise((fulfill, reject) => {
		Console.log('Started running Discord tournament (not implemented)');
		var promises = [
			util.editAnnounce(
				guild,
				str_gen.tourney_announce_channel(discord_constants.MATCH_PHASE)
			),
			util.sendToChannel(
				guild,
				'join',
				str_gen.stub('setup phase over, cannot join anymore','TODO HERE 1831')
			).then((msg) => {
				return util.setPermissions(msg.channel,
				['SEND_MESSAGES'],
				[],
				client);
			})
		];
		var finish_p = Promise.all(promises);
		finish_p
		.then(() => fulfill())
		.catch(() => reject());
	});
};

/*
███████████████████████████████████████████████████████
  Stage: Run
███████████████████████████████████████████████████████
*/

/*

*/
exports.runInitMatchChannel = (guild, role_ids, match_number, ref_id) => {
	return util.createChannelPinMessage(
		guild,
		'match-' + match_number,
		constants.MATCH_CHANNEL,
		str_gen.tourney_match_channel(guild, role_ids, match_number),
		ref_id
	).then((message) => {
		return util.setPermissions(
			message.channel,
			['SEND_MESSAGES', 'READ_MESSAGES'],
			role_ids,
			client);
	});
};

exports.sendConfirmMatchReport = (channel, reporter_user_id, confirmer_role_id, report) => {
	return util.sendConfirmMessage(
		channel,
		str_gen.stub(`Hey <@&${confirmer_role_id}>], <@${reporter_user_id}> says ${report.txt}. Is that right?`, 'join team confirm'),
		discord_constants.MATCH_REPORT_MESSAGE,
		reporter_user_id,
		confirmer_role_id,
		discord_constants.EMOJI_YN,
		//payload
		report
	);
};

/*
Receive Join Confirm

Returns: Promise<object>
see payload from sendConfirmJoinTeam for properties, etc.
*/
exports.receiveConfirmMatchReport = (msgRxn, user) => {
	return util.receiveYNConfirmMessage(
		msgRxn,
		user,
		discord_constants.MATCH_REPORT_MESSAGE
	);
};

// Initiate vote
exports.initiateDisputeVote = (guild, originator_id, defendant_id, challonge_match_id) => {
	var dispute_channel = guild.channels.find('name', 'tourney-dispute');
	return util.sendConfirmMessage(
		dispute_channel,
		str_gen.stub(`Prosecutor: <@${originator_id}>.
			defendant: <@${defendant_id}>.`,
			'jury channel greeting'),
		discord_constants.VOTEKICK_MESSAGE,
		defendant_id,
		'@everyone',
		discord_constants.EMOJI_YN,
		{
			originator_id: originator_id, defendant_id: defendant_id, challonge_match_id: challonge_match_id
		},
		true
	);
};

// Dispute Channels
exports.runInitDisputeChannel = (guild, dispute_name, prosecutor_id, defendant_id) => {
	return util.createChannel(
		guild,
		'dispute-' + dispute_name,
		constants.JURY_CHANNEL
	).then(channel => {
		return util.sendConfirmMessage(
			channel,
			str_gen.stub(`Prosecutor: <@${prosecutor_id}>.
				prosecutor: <@${defendant_id}>.`,
				'jury channel greeting'),
			discord_constants.VOTEKICK_MESSAGE,
			defendant_id,
			'@everyone',
			discord_constants.EMOJI_YN,
			//payload
			{
				new_teammate_id: defendant_id
			},
			true
		);
	});
};

exports.receiveDisputeChannelVote = (msgRxn, user) => {
	return util.countReactions(msgRxn, user, discord_constants.VOTEKICK_MESSAGE);
};

exports.runAnnounceWinner = (guild, winner_name, tourney_url) => {
	return util.editAnnounce(guild, str_gen.tourney_announce_winner(winner_name, tourney_url));
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
	guild.roles
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
