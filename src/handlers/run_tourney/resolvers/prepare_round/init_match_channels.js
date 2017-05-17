// eslint-disable-next-line
var mongo = require('../../../../webservices/mongodb');
var Console = require('../../../../util/console');

var init_match_channels = (guild, matches) => {
	return new Promise((fulfill, reject) => {
		Console.log('  Init-ing match channels for ' + guild.id);

		// TODO: for each match, make a channel and add the right ppl
		matches.forEach((match) => {
			Console.log('    Init dispute ' + match);
		});

		fulfill();
		reject();
	});
};

module.exports = init_match_channels;
