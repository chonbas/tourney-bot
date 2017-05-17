// eslint-disable-next-line
var mongo = require('../../../../webservices/mongodb');
var Console = require('../../../../util/console');

var notify_end_matches = (guild, matches) => {
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

module.exports = notify_end_matches;
