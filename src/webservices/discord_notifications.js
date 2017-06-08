// eslint-disable-next-line
const Console = require('../util/console');

var exports = {};

/*
returns a Promise<mssage>
*/
var dmPlayer = (user_obj, msg_txt) => {
	if(user_obj.dmChannel){
		return user_obj.dmChannel.send(msg_txt);
	}
	return user_obj.createDM()
	.then((channel) => {return channel.send(msg_txt);});
};

/*
returns a Promise<Array<>>
*/
exports.notifyRole = (guild_obj, role_id, message_txt) => {
	var role_obj = guild_obj.roles.get(role_id);
	return Promise.all(role_obj.members.map(user_obj => {
		return dmPlayer(user_obj, message_txt);
	}));
};


exports.notifyPlayer = (guild_obj, player_id, message_txt) => {
	var player_obj = guild_obj.members.get(player_id);
	return dmPlayer(player_obj, message_txt);
};

module.exports = exports;
