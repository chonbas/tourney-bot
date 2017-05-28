/*
These are utils for discord.js.

Do not require this file - use discord.js.
*/
const Console = require('../../util/console');
var db = require('../mongodb');
var db_m = require('../mongodb_messages');
var constants = require('../../util/constants');
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
	emojis
) => {
	return new Promise((fulfill, reject) => {
		var sent_msg;
		channel.send(txt)
		.then((msg) => {
			sent_msg = msg;
			return Promise.all(emojis.map(e => {return msg.react(e);}));
		})
		.then(() => {
			return db_m.setMessage(sent_msg.id, type, creator, recipients);
		})
		.then((sent_msg) => fulfill(sent_msg))
		.catch(err => reject(err));
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
