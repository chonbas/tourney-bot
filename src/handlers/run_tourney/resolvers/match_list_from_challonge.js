// eslint-disable-next-line
var challonge = require('../../../webservices/challonge');
// eslint-disable-next-line
var mongo = require('../../../webservices/mongodb');
var Console = require('../../../util/console');

var get_list = (guild, round) => {
	return new Promise((fulfill, reject) => {
		Console.log('  Retreiving match list for' + guild.id);

		// TODO: actually get matches
		if(round >= 4) {
			Console.log('END: simulating end');
			fulfill([]);
		}
		fulfill(['GARBAGE_MATCH_1', 'GARBAGE_MATCH_2', 'GARBAGE_MATCH_3']);
		reject();
	});
};

module.exports = get_list;
