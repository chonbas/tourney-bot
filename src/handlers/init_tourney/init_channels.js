// eslint-disable-next-line
var Console = require('../../util/console');
// eslint-disable-next-line
var db = require('../../webservices/mongodb');

var constants = require('../../util/constants');

// eslint-disable-next-line
var initChannels = (msg) => {
	return new Promise((fulfill, reject) => {
        msg.guild.createChannel('tourney-general', 'text').then((channel) => {
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

module.exports = initChannels;
