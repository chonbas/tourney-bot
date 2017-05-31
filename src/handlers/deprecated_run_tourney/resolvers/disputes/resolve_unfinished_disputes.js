// eslint-disable-next-line
var mongo = require('../../../../webservices/mongodb');
var Console = require('../../../../util/console');

var resolve_disputes = (guild) => {
	return new Promise((fulfill, reject) => {
		Console.log('  Terminating disputes for ' + guild.id);

		//TODO: get disputes from db
		var disputes = ['GARBAGE_DISPUTE_1', 'GARBAGE_DISPUTE_2'];

		// TODO: for each dispute, force finish
		disputes.forEach((dispute) => {
			Console.log('    Force end dispute ' + dispute);
		});

		fulfill();
		reject();
	});
};

module.exports = resolve_disputes;
