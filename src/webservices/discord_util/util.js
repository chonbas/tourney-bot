/*
These are utils for discord.js.

Do not require this file - use discord.js.
*/
const Console = require('../../util/console');
var db = require('../mongodb');
var db_m = require('../mongodb_messages');
var constants = require('../../util/constants');
var discord_constants = require('./constants');
var exports = {};

var getChannelName = (txt) => {
	return 'tourney-'+txt;
};
/*
Creates a channel and pins a message to the top.
Returns the pinned message in a promise.
*/
exports.createChannelPinMessage = (guild, channel_name, channel_type, welcome_msg) => {
	return new Promise((fulfill, reject) => {
		var channel_created;
		var message_created;
		guild.createChannel(getChannelName(channel_name), 'text').then((channel) => {
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

exports.createChannel = (guild, channel_name, channel_type) => {
	return new Promise((fulfill, reject) => {
		var channel_created;
		guild.createChannel(getChannelName(channel_name), 'text').then((channel) => {
			channel_created = channel;
			return db.createChannel(guild.id, channel_created.id, channel_type);
		}).then((ret_val) => {
			if (ret_val == constants.CREATE_SUCCESS) {
				Console.log('DISCORD: in ' + guild.id + ' created tourney-' + channel_name);
				fulfill(channel_created);
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
exports.setPermissions = (channel, permissions, allowed) => {
	return new Promise((fulfill, reject) => {
		var p_obj = {'SEND_MESSAGES': false};
		permissions.forEach(p => p_obj[p] = false);
		//remove all permissions
		var everyone_role = channel.guild.roles.find('name', '@everyone');
		channel.overwritePermissions(
			everyone_role,
			p_obj
		)
		.then(() => {
			permissions.forEach(p => p_obj[p] = true);
			var promise_array = allowed.map((allowee) => {
				return channel.overwritePermissions(
					allowee,
					p_obj
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
Gives only the allowed roles or users (use an array)
permission to write.

allowed is an array!!

Returns the pinned message in a promise.
*/
exports.sendConfirmMessage = (
	channel,
	txt,
	type,
	creator,
	recipients,
	emojis,
	payload='no payload',
	pin = false
) => {
	return new Promise((fulfill, reject) => {
		var sent_msg;
		channel.send(txt)
		.then((msg) => {
			sent_msg = msg;
			var promises = emojis.map(e => {return msg.react(e);});
			if(pin) promises.push(msg.pin());
			return Promise.all(promises);
		})
		.then(() => {
			return db_m.setMessage(sent_msg.id, type, creator, recipients, payload);
		})
		.then((sent_msg) => fulfill(sent_msg))
		.catch(err => reject(err));
	});
};

exports.isRelevantReaction = (msgRxn, type, msg_data, user, ret) => {
	// if message is an irrelevant message, ignore
	if(!msg_data) {
		ret.payload = 'irrelevant message';
		return false;
	}
	if(msg_data.msg_type != type) {
		ret.payload = 'irrelevant type';
		return false;
	}
	//get user roles
	var roles = msgRxn.message.guild.members.get(user.id).roles;
	if(msg_data.msg_recipients != '@everyone'){
		if(user.id != msg_data.msg_recipients
		&& !roles.get(msg_data.msg_recipients)){
			ret.payload = 'irrelevant reacting user';
			return false;
		}
	}
	return true;
};

exports.receiveYNConfirmMessage = (
	msgRxn,
	user,
	type,
	uses_maybe=false
) => {
	return new Promise((fulfill, reject) => {
		db_m.getMessage(msgRxn.message.id)
		.then((msg_data) => {
			var ret = {};
			ret.status = constants.EMOJI_INVALID;
			if (!exports.isRelevantReaction(msgRxn, type, msg_data, user, ret)) {
				fulfill(ret);
				return;
			}
			// if our recipient, get answer
			switch (msgRxn.emoji.name) {
			case discord_constants.EMOJI_YES_RAW:
				ret.status = constants.EMOJI_YES;
				break;
			case discord_constants.EMOJI_NO_RAW:
				ret.status = constants.EMOJI_NO;
				break;
			case discord_constants.EMOJI_MAYBE_RAW:
				if(uses_maybe){
					ret.status = constants.EMOJI_MAYBE;
				}
				break;
			default: //unknown emoji
				ret.payload = 'unknown emoji';
				fulfill(ret);
				return;
			}
			ret.payload = msg_data.msg_payload;
			fulfill(ret);
		})
		.catch((err) => reject(err));
	});
};

exports.countReactions = (
	msgRxn,
	user,
	type,
	uses_maybe=false
) => {
	return new Promise((fulfill, reject) => {
		db_m.getMessage(msgRxn.message.id)
		.then((msg_data) => {
			var ret = {};
			ret.status = constants.EMOJI_INVALID;
			if (!exports.isRelevantReaction(msgRxn, type, msg_data, user, ret)) {
				fulfill(ret);
				return;
			}
			var counts = {};
			msgRxn.message.reactions.array().forEach((r) => {
				if(r.emoji.name == discord_constants.EMOJI_YES_RAW){
					counts[constants.EMOJI_YES] = r.count -2;
				}
				else if(r.emoji.name == discord_constants.EMOJI_NO_RAW){
					counts[constants.EMOJI_NO] = r.count -2;
				}
				else if(uses_maybe && r.emoji.name == discord_constants.EMOJI_MAYBE_RAW){
					counts[constants.EMOJI_MAYBE] = r.count -2;
				}
			});
			ret.status = constants.EMOJI_COUNTS;
			ret.payload = {};
			ret.payload.original_payload = msg_data.msg_payload;
			ret.payload.counts = counts;
			fulfill(ret);
		})
		.catch((err) => reject(err));
	});
};

exports.editAnnounce = (guild, text) => {
	return new Promise ((fulfill, reject) => {
		var announce_channel = guild.channels.find('name','tourney-announce');
		announce_channel.fetchPinnedMessages()
		.then((msgs) => {
			var announce_msg = msgs.first;
			return announce_msg.edit(text);
		})
		.then(msg => fulfill(msg))
		.catch((err) => {reject(err);});
	});
};

//fulfills with sent message
exports.sendToChannel = (guild, channel_name, text) => {
	return new Promise((fulfill, reject) => {
		var channel = guild.channels.find('name', getChannelName(channel_name));
		channel.send(text)
		.then(msg => fulfill(msg))
		.catch((err) => {reject(err);});
	});
};

module.exports = exports;
