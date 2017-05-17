// eslint-disable-next-line
var mongo = require('../../../../webservices/mongodb');
var Console = require('../../../../util/console');

var init_dispute_channels = (guild) => {
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

module.exports = init_dispute_channels;
