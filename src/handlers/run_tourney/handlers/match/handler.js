/*
MATCH HANDLER

listens for checkins, sets matches to pending (makes them "live" in Challonge)
examines messages to report match scores
examines message to detect disputes
*/

var Console = require('../../../../util/console');
// eslint-disable-next-line
var constants = require('../../../../util/constants');
// eslint-disable-next-line
var challonge = require('../../../../webservices/challonge');
// eslint-disable-next-line
var db = require('../../../../webservices/mongodb');

var handler = {};

// eslint-disable-next-line
handler.handleMsg = (msg) => {
	msg.reply('Run-tourney/match handler handling');
	Console.log('Run-tourney/match handling (not implemented/stubbed)');
	//if other channel, accept disputes

	// if in match channel
	// detect report "report win" - chat parse
	// check pinned for previous report
	// if not already repoted: send a message, pin it, and put starter reactions
	// if already reported: "look at pinned"
};

// eslint-disable-next-line
handler.handleReaction = (msgRxn, user) => {
	// if reported match message
	// AND if user = match message target
	// which emoji?
	// YES: resolve match, update challonge + discord (send message)
	// NO: report the role for dispute resolution
	/*
	var guild = msgRxn.message.guild;
	db.getChannelType(guild.id)
	.then((type) => {
		if(type == constants.JURY_CHANNEL){

		}
	})
	.catch(err => Console.err(err));
	Console.log('Run-tourney/dispute handler: emoji reaction detected');*/
};

var newDispute = () => {
	// put in database
	// discord: pm the defendant with details
};

module.exports = handler;
