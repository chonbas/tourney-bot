const Console = require('../util/console');
const manager = require('./manager');

var exports = {};

exports.addListeners = (client) => {
	client.on('ready', () => {
		Console.log(`Logged in as ${client.user.username}!`);
	});

	client.on('warn', (info) => {
		Console.log(info);
	});

	client.on('error', (err) => {
		Console.error(err);
		process.exit();
	});

	client.on('message', msg => {
		manager.distributeMsg(msg);
	});
};

module.exports = exports;
