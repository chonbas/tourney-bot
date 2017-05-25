/*
These are utils for discord.js.

Do not require this file - use discord.js.
*/
const Console = require('../../util/console');
var db = require('../mongodb');
var constants = require('../../util/constants');
var exports = {};
/*
Creates a channel and pins a message to the top.
Returns the pinned message in a promise.
*/
exports.createChannelPinMessage = (guild, channel_name, channel_type, welcome_msg) => {
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
exports.permissWritesForOnly = (channel, allowed) => {
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
module.exports = exports;
